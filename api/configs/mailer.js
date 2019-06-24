const nodemailer = require('nodemailer');
const config = require('./configs')();

async function sendEmail({ from, to, subject, text, html }) {
  try {
    let testAccount = await nodemailer.createTestAccount();
    const HOSTNAME = config.mailserver.host || 'smtp.ethereal.email';

    // Using https://ethereal.email by default
    let transporter = nodemailer.createTransport({
      host: HOSTNAME,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.mailserver.username || testAccount.user,
        pass: config.mailserver.password || testAccount.pass,
      },
    });

    let info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    if (HOSTNAME === 'smtp.ethereal.email') {
      logger.info(`Message sent! Preview URL ${nodemailer.getTestMessageUrl(info)}`);
    } else {
      logger.info(`Message sent!`);
    }
  } catch (error) {
    logger.error(error);
  }
}

module.exports = sendEmail;
