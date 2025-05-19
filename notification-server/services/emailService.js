const mailer = require("nodemailer");


const transporter = mailer.createTransport({
    secure:true,
    host:'smtp.gmail.com',
    port:465,
    auth :{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

exports.send = async ({title,message,emailId})=>{
      if (!emailId) {
    throw new Error("Email address is required");
  }
    await transporter.sendMail({
        from : process.env.EMAIL_USER,
        to : emailId,
        subject: title,
        text: message
    });
};