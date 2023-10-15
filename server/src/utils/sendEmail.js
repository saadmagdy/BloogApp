import { createTransport } from "nodemailer";

const sendEmail = async (userEmail, subject, htmlTemplate) => {
  try {
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: userEmail,
      subject: subject,
      html: htmlTemplate,
    };
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export default sendEmail;
