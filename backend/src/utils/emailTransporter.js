const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email_to, token) => {
  if (!email_to || !token) {
    throw new Error("Email and token are required to send an email.");
  }
  const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email_to,
    subject: "FastShip - Email Verification",
    html: `<p>Please click the following link to verify your email:</p>
           <a href="${verificationLink}">${verificationLink}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendApprovalEmail = async (email_to, businessName) => {
  if (!email_to || !businessName) {
    throw new Error("Email and business name are required to send an email.");
  }
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email_to,
    subject: "FastShip - Seller Application Approved",
    html: `<p>Congratulations! Your application for the business <strong>${businessName}</strong> has been approved.</p>
           <p>You can now start selling on our platform.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Approval email sent successfully");
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
};

module.exports = {
  sendVerificationEmail,
  sendApprovalEmail,
};
