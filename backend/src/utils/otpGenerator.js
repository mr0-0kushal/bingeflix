import otpGenerator from 'otp-generator'

export const generateOTP = (digits , uC, special, lC) => {
    return otpGenerator.generate(6, {
        digits: digits,
        upperCaseAlphabets: uC,
        specialChars: special,
        lowerCaseAlphabets: lC
    });
}
