import '../styles/login.css'
import logo from '../assets/images/tdt.png'
import Checkbox from '@mui/material/Checkbox';
import { Button, FormControlLabel, Tooltip } from '@mui/material'
import React, { useState, useEffect } from 'react';
import UntilsFunction from '../utils/UtilsFunction';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosClient from '../api/AxiosClient';
import InputValid from '../components/InputValid';

export enum Noti_Status {
    Success,
    Fail
}

export type AccountLogin = {
    Email: string,
    Password: string
}

export function Login() {
    const [dataLogin, setDataLogin] = useState<AccountLogin>({ Email: '', Password: '' });
    const [isPressSpace, setIsPressSpace] = useState<boolean>(false);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const notify = (message: string, status: Noti_Status) => {
        switch (status) {
            case Noti_Status.Success:
                return toast.success(message, {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                break;
            case Noti_Status.Fail:
                return toast.error(message, {
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
    }

    useEffect(() => {
        handleEventKeyDown();

    }, [])

    function onChangeForm(event: React.FormEvent<HTMLInputElement>): void {
        setDataLogin({ ...dataLogin, [event.currentTarget.name]: event.currentTarget.value });
    }

    function onChangeData(name: string, value: string): void {
        setDataLogin({ ...dataLogin, [name]: value });
    }

    function onMouseEnter(event: React.MouseEvent): void {
        setIsPressSpace(true);
    }

    function onClickSubmit(event: React.MouseEvent): void {
        setIsSubmit(true);

        AxiosClient.post('/login', {
            email: dataLogin.Email,
            password: dataLogin.Password,
        }).then((res) => {
            notify('Đăng nhập thành công!', Noti_Status.Success);

            //Set user data
            let token = res.data.authorization.token;

            //Save token
            localStorage.setItem('sgu_token', token);

            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        }).catch((res) => {
            notify('Sai thông tin!', Noti_Status.Fail);
            setIsSubmit(false);
        })
    }

    function handleEventKeyDown(): void {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (!isPressSpace && event.code === "Backspace") setIsPressSpace(true);
        })
    }

    function isValidForm(): boolean {
        return UntilsFunction.isValidEmail(dataLogin.Email) && UntilsFunction.isValidPassword(dataLogin.Password);
    }

    return (
        <div className="login-page">
            <ToastContainer />
            <div className="login-card">
                <div className="login-logo">
                    <div className="logo">
                        <img src={logo} alt="logo tdtu" />
                    </div>
                </div>
                <div className="login-title flex justify-center">
                    Đăng Nhập
                </div>
                <div className="login-description flex justify-center">
                    Đăng nhập để sử dụng hệ thống
                </div>
                <div className="login-form">
                    <InputValid label={'Email: '} name={'Email'} onChangeData={onChangeData} value={dataLogin.Email} isValid={UntilsFunction.isValidEmail(dataLogin.Email)} alert={'Email không hợp lệ'} disabled={false}></InputValid>
                    <InputValid label={'Mật khẩu:  '} name={'Password'} onChangeData={onChangeData} value={dataLogin.Password} isValid={UntilsFunction.isValidPassword(dataLogin.Password)} alert={'Mật khẩu không hợp lệ'} disabled={false}></InputValid>
                    <div className='grid grid-cols-2 w-full justify-start'>
                        <div className='flex items-center'>
                            <Checkbox size='small' />
                            <span className='text-sm font-medium' >Nhớ tài khoản</span>
                        </div>
                    </div>
                    <div onMouseEnter={onMouseEnter} >
                        <Button variant='contained' disabled={!isValidForm()} fullWidth sx={{ height: '2.5rem' }} onClick={onClickSubmit}>  Đăng nhập</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}