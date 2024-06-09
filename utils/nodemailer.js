const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'lab.web@mail.ru',
        pass: 'zQVrM9nkLaZcs6g96x2e'
    }
});

const sendWelcomeEmail = (email, username) => {
    const mailOptions = {
        from: 'lab.web@mail.ru',
        to: email,
        subject: 'Welcome to Our Service',
        text: `Hello ${username}, welcome to our service! We're glad you're here.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = { sendWelcomeEmail };
