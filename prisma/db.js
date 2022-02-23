/**
 * Manages a docker instance of a postgres server for prisma to use as a database.
 */
const child_process = require('child_process');
const path = require('path');
const { createWriteStream, createReadStream } = require('fs');
const fs = require('fs/promises');

// make sure this matches in docker-compose.yml
const CONTAINER_NAME = 'nbdb';
// The amount of time to wait for postgres to be ready to accept connections
const DB_READY_TIMEOUT = 30000;

/**
 * Wrapper for spawning a child process to simplify most spawned calls
 * @param {String} command the command to run
 * @param {Array<String>} args 
 * @param {Object} options
 * @param {String} options.cwd the directory to run the command from
 * @param {Boolean} silent Show the output from stdout
 * @returns 
 */
function spawn(command, args, { cwd = __dirname, silent = false } = {}) {
    const commandString = `${command} ${args.join(' ')}`;
    return new Promise((resolve, reject) => {
        if (!silent) {
            console.log('executing command:', commandString);
            console.log('in dir:', cwd);
        }
        // sub process
        const sp = child_process.spawn(command, args, {
            cwd,
            stdio: 'pipe'
        });
        let stdout = '';
        let stderr = '';
        sp.stdout.on('data', data => {
            const line = data.toString();
            stdout += line;
            if (!silent) {
                console.log(line);
            }
        });
        sp.stderr.on('data', data => {
            const line = data.toString();
            stderr += line;
            if (!silent) {
                console.error(line);
            }
        });
        sp.on('error', reject);
        sp.on('exit', code => {
            if (!silent) {
                console.log('finished command:', commandString);
            }
            if (code === 0) {
                resolve({
                    stdout,
                    stderr
                });
            } else {
                reject(new Error('process exited with code: ' + code));
            }
        });
    });
}

/**
 * Verifies that docker and docker-compose are ready to use
 */
async function verifyInstall() {
    try {
        // 'version' used instead of '--version' so the command will fail without permissions
        await spawn('docker', ['version'], { silent: true });
    } catch (e) {
        console.error(e.message);
        if (e.message.includes('permission denied')) {
            console.error('Make sure docker can be accessed from the current user without sudo');
            console.error('See this link on how to run docker without sudo:');
            console.error('https://github.com/sindresorhus/guides/blob/main/docker-without-sudo.md');
        }
        process.exit(1);
    }
    try {
        await spawn('docker', ['compose', 'version'], { silent: true });
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}

/**
 * Creates a new container for the db using the docker-compose.yml
 */
function createContainer() {
    console.log('Creating database container...');
    return new Promise((resolve, reject) => {
        const compose = spawn('docker', ['compose', 'up', '-d']);
        // Wait until the server is ready to accept connection
        compose.then(() => {
            // Set a timeout to wait for postgres to be ready
            const timeout = setTimeout(() => {
                reject(new Error('Timed out while waiting for postgres'));
            }, DB_READY_TIMEOUT);

            console.log('Database container created, waiting for postgres to be ready...');
            const readyMessage = 'database system is ready to accept connections';
            const logs = child_process.spawn('docker', ['logs', '-f', CONTAINER_NAME], {
                stdio: [null, null, 'pipe']
            });
            // For some reason postgres' log messages are sent to stderr by default
            logs.stderr.on('data', data => {
                const line = data.toString();
                if (line.includes(readyMessage)) {
                    console.log(readyMessage);
                    clearTimeout(timeout);
                    logs.kill();
                    resolve();
                }
            });
            logs.on('error', reject);
        });
        compose.catch(reject);
    });
}

/**
 * @returns {Boolean} if a container with CONTAINER_NAME exists
 */
async function containerExists() {
    try {
        const { stdout } = await spawn('docker', ['container', 'ls', '-a'], { silent: true });
        const regex = new RegExp(`^\\w+\\s+postgres.*${CONTAINER_NAME}`, 'm');
        return regex.test(stdout);
    } catch (e) {
        return false;
    }
}

/**
 * @returns {Boolean} if a container with CONTAINER_NAME is running
 */
async function isRunning() {
    try {
        const { stdout } = await spawn('docker', ['inspect', '-f', '{{.State.Running}}', CONTAINER_NAME], { silent: true });
        if (stdout.includes('true')) {
            return true;
        } else if (stdout.includes('false')) {
            return false;
        }
    } catch (e) {
        return false;
    }
}

/**
 * Executes an action while ensuring the database container is running and
 * returns the container to it's initial running state after completion
 * @param {Function} action The function to be run while the container is running
 */
async function runWrapper(action, ignoreSchema) {
    const initialRunning = await isRunning();
    if (!initialRunning) {
        await start(ignoreSchema);
    }
    await action();
    if (!initialRunning) {
        await stop();
    }
}

/**
 * Executes the raw schema update command
 */
async function _schema() {
    await spawn('npx', ['prisma', 'migrate', 'dev']);
    console.log('Schema applied');
}

/**
 * Updates the schema for prisma
 */
async function schema() {
    await runWrapper(_schema, true);
}

/**
 * Makes sure the container is running. Creates a new one and applies schema if necessary
 * @param {Boolean} ignoreSchema Don't initialize schema if a new container is created
 */
async function start(ignoreSchema) {
    const _start = async () => {
        await spawn('docker', ['container', 'start', CONTAINER_NAME], { silent: true });
    };
    if (!(await isRunning())) {
        if (await containerExists()) {
            await _start();
        } else {
            console.log('Database container not found, creating one...');
            await createContainer();
            await _start();
            if (!ignoreSchema) {
                console.log('Applying schema...');
                await _schema();
            }
        }
    }
    console.log('Database container started');
}

/**
 * Makes sure the container is stopped
 */
async function stop() {
    if (await containerExists()) {
        if (await isRunning()) {
            await spawn('docker', ['container', 'stop', CONTAINER_NAME], { silent: true });
        }
    }
    console.log('Database container stopped');
}

/**
 * Resets the data in the database
 */
async function reset() {
    if (await containerExists()) {
        await runWrapper(async () => {
            await spawn('npx', ['prisma', 'migrate', 'reset', '--force']);
        });
    }
}

async function deleteContainer() {
    if (await containerExists()) {
        if (await isRunning()) {
            await stop();
        }
        await spawn('docker', ['container', 'rm', CONTAINER_NAME]);
        console.log('Database container removed');
    } else {
        throw new Error(`There is no '${CONTAINER_NAME}' container`);
    }
}


// https://davejansen.com/how-to-dump-and-restore-a-postgresql-database-from-a-docker-container/

/**
 * Backs up the the database dump into the /backups folder
 * @returns the filename of the backup
 */
function backup() {
    return new Promise((resolve, reject) => {
        spawn('mkdir', ['-p', './backups']).then(async () => {
            await runWrapper(async () => {
                const backup = child_process.spawn('docker', ['exec', '-i', CONTAINER_NAME, '/bin/bash', '-c', 'pg_dump --username postgres initdb']);
                const outputFile = path.resolve(__dirname, 'backups', Date.now() + '.sql');
                console.log(outputFile);
                backup.stdout.pipe(createWriteStream(outputFile));
                await backup;
                resolve(outputFile);
            });
        }).catch(reject);
    });
}

/**
 * Restores the database from the last sql dump in the backups folder
 * @param {String} filename specify the dump file to restore from
 * @returns 
 */
async function restore(filename) {
    // Get the last dump file in the backups folder
    if (!filename) {
        const backups = path.resolve(__dirname, 'backups');
        const files = await fs.readdir(backups);
        if (files.length > 0) {
            filename = path.resolve(backups, files[files.length - 1]);
        } else {
            throw new Error(`No backups found in ${backups}`);
        }
    }
    return new Promise((resolve, reject) => {
        runWrapper(async () => {
            try {
                // Force drop database
                await spawn('docker', ['exec', '-i', CONTAINER_NAME, '/bin/bash', '-c', 'psql --username postgres -c "DROP DATABASE initdb WITH (FORCE);"']);
            } catch (e) {
                if (!e.message.includes('does not exist')) reject(e);
            }
            try {
                // Create database
                await spawn('docker', ['exec', '-i', CONTAINER_NAME, '/bin/bash', '-c', 'createdb --username postgres initdb']);
                // Restore from dump
                const fileStream = createReadStream(filename);
                fileStream.on('open', () => {
                    child_process.spawn('docker', ['exec', '-i', CONTAINER_NAME, '/bin/bash', '-c', 'psql --username postgres initdb'], {
                        stdio: [fileStream, 'inherit', 'inherit']
                    });
                });
            } catch (e) {
                reject(e);
            }
        }).then(resolve).catch(reject);
    });


}

// Check if we are being run from the command line
if (require.main === module) {
    (async () => {
        await verifyInstall();
        if (process.argv.includes('--start')) {
            start();
        } else if (process.argv.includes('--stop')) {
            stop();
        } else if (process.argv.includes('--reset')) {
            reset();
        } else if (process.argv.includes('--schema')) {
            schema();
        } else if (process.argv.includes('--delete')) {
            deleteContainer();
        } else if (process.argv.includes('--backup')) {
            backup();
        } else if (process.argv.includes('--restore')) {
            const restoreIndex = process.argv.indexOf('--restore');
            let filename = undefined;
            if (process.argv[restoreIndex + 1]) {
                filename = path.resolve(process.argv[restoreIndex + 1]);
            }
            restore(filename);
        } else {
            console.log('Please specify an action (ordered by priority):');
            console.log('--start');
            console.log('--stop');
            console.log('--reset');
            console.log('--schema');
            console.log('--delete');
            console.log('--backup');
            console.log('--restore');
        }
    })();
}

module.exports = {
    isRunning,
    schema,
    start,
    stop,
    backup,
    restore
};