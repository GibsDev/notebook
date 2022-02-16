import CryptoJS from 'crypto-js';

export default (key) => {
    return {
        encrypt: (input) => {
            return CryptoJS.AES.encrypt(input, key).toString();
        },
        decrypt: (input) => {
            return CryptoJS.AES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
        }
    };
};
