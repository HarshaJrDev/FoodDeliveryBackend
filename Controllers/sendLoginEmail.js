import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,    
    pass: process.env.EMAIL_PASS,    
  },
});

const sendLoginEmail = async (toEmail, userName) => {
  const mailOptions = {
    from: `"Delivery App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Login Notification",
    html: `
      <h3>Hello ${userName},</h3>
      <p>You just logged in to your account. If this wasn't you, please reset your password immediately.</p>
      <p>Best regards,<br/>Delivery App Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Login email sent to ${toEmail}`);
  } catch (err) {
    console.error("Email send error:", err.message);
  }
};

export default sendLoginEmail;
