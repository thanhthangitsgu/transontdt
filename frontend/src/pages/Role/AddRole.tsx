import { Button, Dialog, DialogContent, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useState } from "react";
import InputValid from "../../components/InputValid";
import AddToPhotosRoundedIcon from '@mui/icons-material/AddToPhotosRounded';
import AxiosAuth from "../../api/AxiosAuth";
import UntilsFunction from "../../utils/UtilsFunction";

type props = {
    isOpen: boolean,
    setOpen: Function,
    addRole: Function
}
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} timeout={50000} {...props} />;
});

export default function AddRole({ isOpen, setOpen, addRole }: props) {
    const [name, setName] = useState<string>('');

    function onChange(name: string, value: string): void {
        setName(value);
    }

    function handleAddRole(): void {
        AxiosAuth.post('roles', { name: name }).then((data) => {
            let role = data.data.data;
            addRole(role);
            UntilsFunction.showToastSuccess('Thêm quyền thành công!');
            setOpen(false);
        }).catch(() => {
            UntilsFunction.showToastError('Đã có lỗi xảy ra!');
        })
    }
    return (
        <Dialog
            open={isOpen}
            keepMounted
            TransitionComponent={Transition}
            fullWidth={true}
            maxWidth='xs'
            onClose={() => setOpen(false)}
        >
            <DialogContent className="dialog">
                <div className="dialog-title">Thêm quyền</div>
                <div className="dialog-content">
                    <InputValid label={"Tên quyền"} name={"name"} onChangeData={onChange} value={name} isValid={false} alert={""} disabled={false} />
                </div>
                <div className="dialog-action">
                    <Button startIcon={<AddToPhotosRoundedIcon />} variant="contained" onClick={handleAddRole}> Thêm quyền</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}