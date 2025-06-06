import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const sendRegisterSMS = async (phone, name) => {
    const options = {
        method: 'POST',
        url: 'https://www.fast2sms.com/dev/bulkV2',
        headers: {
            'authorization': process.env.FAST_2_SMS_API_KEY,
            'Content-Type': 'application/json'
        },
        data: {
            message: `Hey ${name},\nWelcome to Bingeflix,\nThanks for registering on our platform. Enjoy your day with Bingeflix`,
            route: 'p',
            numbers: phone
        }
    };

    try {
        const response = await axios.request(options);
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // const status = error.response?.status;
            // const message = error.response?.data?.message || error.message;
            // console.error(`Axios error: ${status} - ${message}`);
            return error.response
        } else {
            return error
        }
    }

}

const sendOTPSMS = async (phone, otp) => {
    const options = {
        "async": true,
        "crossDomain": true,
        "url": "https://www.fast2sms.com/dev/bulkV2",
        "method": "POST",
        "headers": {
            "authorization": process.env.FAST_2_SMS_API_KEY,
        },
        "data": {
            "variables_values": otp,
            "route": "otp",
            "numbers": phone,
        }
    }
    try {
        const response = await axios.request(options);
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // const status = error.response?.status;
            // const message = error.response?.data?.message || error.message;
            // console.error(`Axios error: ${status} - ${message}`);
            return error.response
        } else {
            return error
        }
    }
}

export {
    sendRegisterSMS,
    sendOTPSMS
}