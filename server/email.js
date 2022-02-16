const nodemailer = require('nodemailer');

async function email({ subject, text, html }) {
    return new Promise((resolve, reject) => {

        const { host, user, name, pass, productionOnly } = require('./config.json');

        if (productionOnly && process.env.NODE_ENV !== 'production') {
            console.log('Email config.productionOnly enabled (not sent)');
            console.log('subject:');
            console.log(subject);
            console.log('text:');
            console.log(text);
            console.log('\nhtml:');
            console.log(html);
            return resolve();
        }

        const transporter = nodemailer.createTransport({
            host,
            port: 465,
            secure: true,
            auth: {
                user,
                pass,
            },
        });

        transporter.verify(function (err, success) {
            if (err) {
                reject(err);
            } else if (success) {
                transporter.sendMail({
                    from: {
                        name,
                        address: user
                    },
                    to: 'notcurtisg@gmail.com',
                    subject,
                    text,
                    html
                }, (err, info) => {
                    if (err) {
                        reject(err);
                    } else if (info) {
                        resolve();
                    }
                });
            }
        });
    });
}

module.exports = email;