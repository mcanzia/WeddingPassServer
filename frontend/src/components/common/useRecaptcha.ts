
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { auth } from '@/firebase';

export function useRecaptcha() {
    const recaptchaVerifier: any = ref(null);

    onBeforeUnmount(() => {
        resetRecaptcha();
    });

    function initializeRecaptcha() {

        if (recaptchaVerifier.value) {
            recaptchaVerifier.value.clear();
            recaptchaVerifier.value = null;
        }

        recaptchaVerifier.value = new auth.RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response: string) => {
                console.log('reCAPTCHA solved with response:', response);
            },
            'expired-callback': () => {
                console.log('reCAPTCHA expired. Resetting...');
                resetRecaptcha();
            }
        }, auth);

        if (recaptchaVerifier.value) {
            recaptchaVerifier.value.render().then((widgetId: number) => {
                console.log('reCAPTCHA widget rendered with ID:', widgetId);
            }).catch((error: any) => {
                console.error('Error rendering reCAPTCHA:', error);
            });
        }
    }

    function resetRecaptcha() {
        if (recaptchaVerifier.value) {
            recaptchaVerifier.value.clear();
            recaptchaVerifier.value = null;
        }
    }

    return {
        recaptchaVerifier,
        initializeRecaptcha,
        resetRecaptcha
    };
}
