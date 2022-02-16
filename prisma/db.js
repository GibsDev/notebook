/**
 * Manages a docker instance of a postgres server for prisma to use as a database.
 */

const util = require('util');
const open = require('open');
const child_process = require('child_process');
const exec = util.promisify(require('child_process').exec);
const path = require('path');

const POSTGRES_BIND_DIR = path.resolve(__dirname, 'postgresdata');
console.log('__dirname', __dirname);
console.log('POSTGRES_BIND_DIR', POSTGRES_BIND_DIR);

const CONTAINER_NAME = 'nbdb';
const PORT = 5432;

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
    } else {
        console.log('Please specify an action (ordered by priority):');
        console.log('--start');
        console.log('--stop');
        console.log('--reset');
    }
})();

/**
 * Spawns a child process and forwards stdio
 */
function execOut(command, args) {
    return new Promise((resolve, reject) => {
        const child = child_process.spawn(command, args, {
            stdio: 'inherit'
        });
        child.on('error', reject);
        child.on('exit', resolve);
    });
}

/**
 * Verifies that docker is available from the current user
 */
async function verifyInstall() {
    try {
        // '--version' will not check for permissions
        await exec('docker version');
    } catch (e) {
        console.error(e.message);
        console.error('Make sure docker is installed and can be accessed without sudo');
        console.error('See this link on how to run docker without sudo:');
        const link = 'https://github.com/sindresorhus/guides/blob/main/docker-without-sudo.md';
        console.error(link);
        try {
            await open(link);
        } catch (e) {
            console.error(e);
        }
        process.exit(1);
    }
}

/**
 * Verifies the latest image of postgres is available
 */
async function verifyImage() {
    try {
        const images = await exec('docker images');
        // Check for the latest postgres image
        const matches = /^postgres\s+latest/m.test(images.stdout);
        if (!matches) {
            console.log('Latest image of postegres not available');
            console.log('Fetching postgres image...');
            await execOut('docker', ['pull', 'postgres']);
        }
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

/**
 * Creates a new container for the db using the postgres image
 */
async function createContainer() {
    await verifyImage();
    const { stdout } = await exec(`docker create --name ${CONTAINER_NAME} -p ${PORT}:${PORT} -e POSTGRES_HOST_AUTH_METHOD=trust -e PGDATA=/var/lib/postgresql/data/pgdata --mount type=bind,source=${POSTGRES_BIND_DIR},target=/var/lib/postgresql/data postgres`);
    console.log(stdout);
}

/**
 * @returns {Boolean} if a container with CONTAINER_NAME exists
 */
async function containerExists() {
    const { stdout } = await exec('docker container ls -a');
    const regex = new RegExp(`^\\w+\\s+postgres.*${CONTAINER_NAME}`, 'm');
    if (regex.test(stdout)) {
        return true;
    }
    return false;
}

/**
 * @returns {Boolean} if a container with CONTAINER_NAME is running
 */
async function isRunning() {
    try {
        const inspect = await exec(`docker inspect -f "{{.State.Running}}" '${CONTAINER_NAME}'`);
        if (inspect.stdout.includes('true')) {
            return true;
        } else if (inspect.stdout.includes('false')) {
            return false;
        }
    } catch (e) {
        return false;
    }
}

/**
 * Executes an action while ensuring the database container is running and
 * returns the container to it's initial running state after completion
 * @param {function} action The function to be run while the container is running
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
    await execOut('npx', ['prisma', 'migrate', 'dev']);
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
        await exec(`docker container start ${CONTAINER_NAME}`);
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
            await exec(`docker container stop ${CONTAINER_NAME}`);
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
            await execOut('npx', ['prisma', 'migrate', 'reset']);
        });
    }
}

async function deleteContainer() {
    if (await containerExists()) {
        if (await isRunning()) {
            await stop();
        }
        await exec(`docker container rm ${CONTAINER_NAME}`);
        console.log('Database container removed');
    } else {
        console.error(new Error(`There is no '${CONTAINER_NAME}' container`));
        process.exit(1);
    }
}