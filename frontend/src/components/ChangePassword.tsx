import { Button, Dialog, DialogContent, Input, Slide } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { setShowModal } from "../redux/store/PasswordSlice";
import React, { useEffect, useState } from "react";
import { TransitionProps } from "@mui/material/transitions";
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import InputValid from "./InputValid";
import AxiosAuth from "../api/AxiosAuth";
import UntilsFunction from "../utils/UtilsFunction";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} timeout={50000} {...props} />;
});

type ChangeForm = {
    current: string,
    new: string,
    confirm: string,
}

export default function ChangePassword() {
    let showModal = useSelector<RootState, boolean>(state => state.password);
    const dispatch: AppDispatch = useDispatch();
    const [dataForm, setDataForm] = useState<ChangeForm>({ current: '', new: '', confirm: '' });
    const [validNew, setValidNew] = useState<boolean>(false);
    const [validConfirm, setValidConfirm] = useState<boolean>(false);
    const [textNew, setTextNew] = useState<string>('');
    const [textConfirm, setTextConfirm] = useState<string>('');

    function onChangeData(name: string, value: string) {
        setDataForm({ ...dataForm, [name]: value });
    };

    useEffect(() => {
        if (dataForm.new.length < 8) setTextNew('Mật khẩu phải dài hơn 8 ký tự');
        if (dataForm.confirm.length < 8) setTextConfirm('Mật khẩu phải dài hơn 8 ký tự');
        if (dataForm.new !== dataForm.confirm) setTextConfirm('Mật khẩu không khớp');

        setValidNew(dataForm.new.length >= 8);
        setValidConfirm(dataForm.confirm === dataForm.new);
    }, [dataForm]);

    function onSubmit(): void {
        console.log('test');
        
        AxiosAuth.post(`update-password`, {
            old_password: dataForm.current,
            new_password: dataForm.new,
            confirm_password: dataForm.confirm
        }).then((data) => {
            console.log(data);
            UntilsFunction.showToastSuccess('Đổi mật khẩu thành công!')
        }).catch((e) => {
            UntilsFunction.showToastError("Mật khẩu không chính xác!");
        })
    }


    return (
        <div className="change-pass">
            <Dialog
                open={showModal}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                TransitionComponent={Transition}
                onClose={() => dispatch(setShowModal(false))}
                fullWidth
                maxWidth='xs'
            >
                <DialogContent>
                    <div className="dialog-password">
                        <div className="dialog-account--title">Đổi mật khẩu</div>
                        <div className="dialog-password-content mt-8">
                            <div className="dialog-row">
                                <InputValid label={"Mật khẩu hiện tại"} name={"current"} onChangeData={onChangeData} value={dataForm.current} isValid={dataForm.current.length >= 8} alert={"Mật khẩu phải lớn hơn 8 ký tự"} disabled={false} text="password" />

                            </div>
                            <div className="dialog-row mt-8">
                                <InputValid label={"Mật khẩu mới"} name={"new"} onChangeData={onChangeData} value={dataForm.new} isValid={validNew} alert={textNew} disabled={false} text="password" />
                            </div>
                            <div className="dialog-row mt-8">
                                <InputValid label={"Xác nhận"} name={"confirm"} onChangeData={onChangeData} value={dataForm.confirm} isValid={validConfirm} alert={textConfirm} disabled={false} text="password" />
                            </div>
                        </div>
                        <div className="dialog-password--action mt-4 flex justify-end">
                            <Button className="dialog-password--button-close" variant="contained" startIcon={<SaveAsRoundedIcon />} disabled={!validNew || !validConfirm || dataForm.current.length < 8}  onClick={onSubmit}>Lưu</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}