import { Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import { toast } from "react-toastify";

const isValidEmail = (val: string | null) => {
    if (!val) return false;
    let valid = ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)));
    return valid;
}

const isValidPassword = (val: string) => {
    return val.length >= 8;
}

const showToastSuccess = (message: string) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}

const showToastError = (message: string) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}

const isValidPhone = (phone: string | null) => {
    if (!phone) return false;
    let vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    return vnf_regex.test(phone);
}

const isValidForm = (form: any) => {
    let keys = Object.keys(form);
    for (let key of keys) if (form[key] === false) return false;
    return true;
}

const debounce = (func: Function, timeout: number = 50) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), timeout);
    };
}

const UntilsFunction = {
    isValidEmail, isValidPassword, showToastSuccess, showToastError, isValidPhone, isValidForm, debounce
}




export const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} timeout={50000} {...props} />;
});
export default UntilsFunction;