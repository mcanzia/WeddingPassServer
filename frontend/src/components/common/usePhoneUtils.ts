import _ from 'lodash';

export function usePhoneUtils() {

    function maskPhone(phone: string) {
        const match = phone.match(/(\+\d{1,2})(\d{4})(\d+)/);
        if (match) {
            return match[1] + _.repeat('*', phone.length - 5) + match[3].slice(-2);
        }
        return phone.replace(/\d(?=\d{2})/g, '*');
    }

    return {
        maskPhone
    }
}