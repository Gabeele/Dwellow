require("dotenv").config();
const nodemailer = require("nodemailer");
const logger = require("./logger");

// Generates a unique code for the invitation
function generateCode() {
    const length = 6;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';  // Allows for 1402410240 unique codes
    let result = '';
    const isUnique = false;

    do {
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        // TODO: Add to db and check if unique
    } while (isUnique);

    logger.info(`Generated code: ${result}`);

    return result;
}

// Sends the code to the user's email
async function sendCodeByEmail(email, code) {

    const subject = "Invitation Code";
    const text = `Your invitation code is: ${code}`;

    try {
        // Create a transporter
        let transporter = nodemailer.createTransport({
            host: process.env.INVITATION_SMTP,
            port: process.env.INVITATION_PORT,
            auth: {
                user: process.env.INVITATION_EMAIL,
                pass: process.env.INVITATION_PASSWORD,
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: process.env.INVITATION_EMAIL, // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
        });

        logger.info(`Message sent: ${info.messageId}`);
        return `Message sent: ${info.messageId}`;
    } catch (error) {
        logger.error(`Something went wrong in the sendmail method. Error: ${error.message}`);
        throw new Error(
            `Something went wrong in the sendmail method. Error: ${error.message}`
        );
    }

}

module.exports = {
    generateCode,
    sendCodeByEmail

};