/**
 * Asks the user questions about SMTP configurations to generate a configuration file
 */
const fs = require('fs/promises');
const path = require('path');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function prompt(query) {
    return new Promise(resolve => {
        readline.question(query, resolve);
    });
}

async function booleanPrompt(defaultValue, query) {
    let answer = null;
    do {
        answer = await prompt(query + ' (y/n)\n');
        if (answer === '') {
            answer = defaultValue;
        } else if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            answer = true;
        } else if (answer.toLowerCase() === 'n' || answer.toLowerCase() === 'no') {
            answer = false;
        } else {
            console.log('Invalid answer:', `'${answer}'`);
            answer = null;
        }
    } while (answer === null);
    return answer;
}


console.log('This script will guide you through making an SMPT email configuration so that the server can send emails');
console.log('');

(async () => {
    let host = await prompt('Enter the host of the SMPT server (smpt.example.com):\n');
    if (!host) {
        host = 'smpt.example.com';
    }

    let port = await prompt('Enter the port for the server (456):\n');
    if (port) {
        port = parseInt(port);
    } else {
        port = 465;
    }

    let user = await prompt('Enter the username for your account:\n');
    if (!user) {
        user = 'example_username';
    }

    let pass = await prompt('Enter the password for your account:\n');
    if (!pass) {
        pass = 'example_password';
    }

    let name = await prompt('Enter the name that you would like emails to show up as (Notebook):\n');
    if (!name) {
        name = 'Notebook';
    }
    // Using single quotes prevents it from being formatted in lastname, firstname format
    name = `'${name}'`;

    let devEmails = await booleanPrompt(false, 'Do you want emails to be sent in development mode?');

    const config = {
        name,
        host,
        port,
        user,
        pass,
        productionOnly: !devEmails
    };

    const saveConfig = async () => {
        console.log('Config generated:');
        console.log(config);
        console.log('Writing to \'/server/config.json\'');
        await fs.writeFile(path.resolve(__dirname, 'config.json'), JSON.stringify(config, null, 4));
        console.log('Config saved');
    };

    const filename = path.resolve(__dirname, 'config.json');
    try {
        // Check existing
        await fs.stat(filename);
        const overwrite = await booleanPrompt(false, 'Do you want to overwrite existing config file?');
        if (overwrite) {
            await saveConfig();
        }
    } catch (e) {
        // config does not exist
        await saveConfig();
    }
    
    process.exit(0);
})();
