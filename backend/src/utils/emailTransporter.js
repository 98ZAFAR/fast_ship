const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (email_to, token) => {
    if (!email_to || !token) {
        throw new Error('Email and token are required to send an email.');
    }
    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email_to,
        subject:"FastShip - Email Verification",
        html: `<p>Please click the following link to verify your email:</p>
           <a href="${verificationLink}">${verificationLink}</a>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = {
    sendEmail
};