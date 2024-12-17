const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "sherwalji89@gmail.com",
    pass: "ucxu mana vhhl zvpr",
  },
});

async function sendOtpTorecieverEmail(recieverEmail, text) {
  try {
    const mailOption = {
      from: "sherwalji89@gmail.com",
      to: recieverEmail,
      subject: "otp testing ",
      text: text,
    };
    await transporter.sendMail(mailOption);
  } catch (err) {
    console.log("MESSAGE : error during send mail in mail function");
  }
}

module.exports = sendOtpTorecieverEmail;
