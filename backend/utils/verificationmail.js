import nodemailer from "nodemailer";
const verifmail = async (email, link) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        //EMAİL GÖNDER
        let info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Email Verification",
            text: `WELCOME`,
            html: `<h1>Click on the link below to verify your email</h1><br><a href=${link}>${link}</a>`,
        });
        console.log("Message sent successfully");
    }catch (error) {
        console.log("Error in sending email", error);
    }
};
export default verifmail;