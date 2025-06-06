import axios from 'axios'

const sendOTPSMS = async (phone, otp) => {
    const apiKey = process.env.TWO_FACTOR_API_KEY;

    const url = `https://2factor.in/API/V1/${apiKey}/SMS/${phone}/${otp}/OTP1`; 
    // OTP1 is the template name (default provided by 2Factor)

    try {
        const response = await axios.get(url);
        return response.data; // Success response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data || { message: error.message };
        } else {
            return { message: "Non-Axios error occurred", error };
        }
    }
};


export {
    sendOTPSMS
}
