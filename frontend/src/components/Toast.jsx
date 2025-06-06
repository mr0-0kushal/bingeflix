// components/ToastNotifier.jsx
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = ({message, flag}) => {
    // console.log(message, flag)
    useEffect(() => {
        if (message && flag) {
            switch (flag) {
                case "success":
                    toast.success(message);
                    break;
                case "error":
                    toast.error(message);
                    break;
                case "warning":
                    toast.warn(message);
                    break;
                case "info":
                    toast.info(message);
                    break;
                default:
                    toast(message);
            }
        }
    }, [message, flag]);

    return <ToastContainer position="bottom-right" autoClose={3000} />;
};

export default Toast;
