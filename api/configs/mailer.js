const nodemailer = require('nodemailer');

// Using https://ethereal.email
const HOSTNAME = 'smtp.ethereal.email';
const USERNAME = 'abbie47@ethereal.email';
const PASSWORD = 'cyVc2nUzTp6KajP95W';

async function sendEmail({ from, to, subject, text, html }) {
  try {
    let transporter = nodemailer.createTransport({
      host: HOSTNAME,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: USERNAME,
        pass: PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    const { message_id } = info.response.match(/MSGID=(?<message_id>.*)./).groups;
    logger.info(`Message sent! Preview URL https://ethereal.email/message/${message_id}`);
  } catch (error) {
    logger.error(error);
  }
}

module.exports = sendEmail;
