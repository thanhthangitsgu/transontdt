import { Button, Dialog, DialogContent, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { ChangeEvent, useState } from "react";
import AxiosClient from "../../api/AxiosClient";
import { toast } from "react-toastify";
import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import { LoadingButton } from "@mui/lab";
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} timeout={50000} {...props} />;
});

type prop = {
    open: boolean,
    setOpen: Function,
    addAccount: Function
}
export default function PopupAddAccount({ open, setOpen, addAccount }: prop) {
    const [email, setEmail] = useState<string>('');
    const [role, setRole] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    function onChangeEmail(event: React.FormEvent<HTMLInputElement>): void {
        setEmail(event.currentTarget.value);
    }

    function onChangeRole(event: SelectChangeEvent): void {
        setRole(parseInt(event.target.value));
    }
    //Creat account
    function postAccount(): void {
        let data = {
            email: email,
            password: '12345678',
            role_id: role
        };

        setIsLoading(true);

        AxiosClient.post('accounts', data).then((data) => {
            //Set list
            addAccount(email, role, data.data.data.id);

            //Show message
            toast.success('Thêm tài khoản thành công!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            //Close poup
            setTimeout(() => {
                setOpen(false);
            }, 500);

        }).catch((e) => {
            //Show message
            toast.error(`Lỗi: ${e.message}`, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            console.log(e);
        }).finally(() => { setIsLoading(false); })
    }

    return (
        <div className="popup-add-account">
            <Dialog
                open={open}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                TransitionComponent={Transition}
                onClose={() => setOpen(false)}
                fullWidth={true}
                maxWidth='sm'
            >
                <DialogContent className="dialog-account">
                    <div className="dialog-add-account">
                        <div className="dialog-account--title">Thêm tài khoản</div>
                        <div className="dialog-account-content">
                            <div className="dialog-row">
                                <label htmlFor="">Email: </label>
                                <div className="input-wrapper">
                                    <input type="email" value={email} name='email' onChange={onChangeEmail} />
                                </div>
                            </div>
                            <div className="dialog-row">
                                <label htmlFor="">Vai trò: </label>
                                <Select
                                    defaultValue={`${1}`}
                                    sx={{ height: '2.5rem', width: '85%', textAlign: 'center' }}
                                    value={`${role}`}
                                    onChange={onChangeRole}
                                >
                                    <MenuItem value={1} >Admin</MenuItem>
                                    <MenuItem value={5} >Training Department</MenuItem>
                                </Select>

                            </div>
                        </div>

                        <div className="dialog-password--action flex w-full justify-end">
                            <LoadingButton sx={{
                                backgroundColor: '#1976d2', '&:hover': {
                                    backgroundColor: '#1565c0'
                                },
                                '&:disabled': {
                                    backgroundColor: '#42a5f5',
                                    color: 'white'
                                }
                            }}
                                className="dialog-password--button-close"
                                startIcon={< PersonAddAltRoundedIcon />}
                                variant="contained"
                                loading={isLoading}
                                onClick={postAccount}
                                loadingPosition="start"
                                disabled={isLoading}>
                                <span>Thêm tài khoản</span>
                            </LoadingButton>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}