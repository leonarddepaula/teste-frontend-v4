import Vue3Toastify, {toast} from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Vue3Toastify, {
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
    
    const $toast = {
        success: (message: string) => toast.success(message),
        error: (message: string) => toast.error(message),
    };
    
    nuxtApp.provide("toast", $toast);
})