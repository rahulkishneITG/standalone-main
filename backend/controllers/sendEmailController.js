const sendMail = require("../services/mailerService.js");

exports.sendEmailController = async (req, res) => {
    const { to, subject, text, html } = req.body;
    console.log("Received email details:", { to, subject, text, html });  
    
    try {
      
        const info = await sendMail.sendEmail(to, subject, text, html);
        res.status(200).send({ message: 'Email sent successfully', info });
    } catch (error) {
        console.error("Error sending email:", error); 
        res.status(500).send({ message: 'Failed to send email', error: error.message });
    }
};
