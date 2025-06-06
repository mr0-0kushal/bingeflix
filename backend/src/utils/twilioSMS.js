import twilio from 'twilio'
import dotenv from 'dotenv'
dotenv.config()


const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const verifyService = async () => {
      return await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
            .verifications
            .create({
                  to: process.env.TWILIO_NUMBER ,
                  channel: 'sms'
            })
            .then(verification => console.log(verification.sid));
}

const sendRegisterSMS = async (receiverNum, name) => {
      const message = await client.messages.create({
            body: `Dear ${name},\n
            Welcome to BingFlix\n
            Thanks for Registering on our platform. Enjoy your day on BingeFlix\n
            Regards BingeFlix.`,
            from: process.env.TWILIO_NUMBER,
            to: receiverNum,
      });
      console.log(message.body);
      return message
}

export {
      verifyService,
      sendRegisterSMS
}