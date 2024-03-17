import { Button, Dialog, DialogContent, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useState } from "react";
import InputValid from "../../components/InputValid";
import AddToPhotosRoundedIcon from '@mui/icons-material/AddToPhotosRounded';
import AxiosAuth from "../../api/AxiosAuth";
import UntilsFunction from "../../utils/UtilsFunction";
import AxiosClient from "../../api/AxiosClient";
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';

type props = {
    isOpen: boolean,
    setOpen: Function,
    editRole: Function,
    idRole: number,
    initName: string
}
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} timeout={50000} {...props} />;
});

export default function EditRole({ isOpen, setOpen, editRole, idRole, initName }: props) {
    const [name, setName] = useState<string>('');

    useEffect(() => {
        setName(initName);
    }, [initName])

    function onChange(name: string, value: string): void {
        setName(value);
    }

    function handleEditRole(): void {
        AxiosClient.put(`roles/${idRole}`, { name: name }).then(() => {
            editRole(name);
            UntilsFunction.showToastSuccess('Cập nhật quyền thành công!');
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
                <div className="dialog-title">Chỉnh sửa quyền</div>
                <div className="dialog-content">
                    <InputValid label={"Tên quyền"} name={"name"} onChangeData={onChange} value={name} isValid={false} alert={""} disabled={false} />
                </div>
                <div className="dialog-action">
                    <Button startIcon={< EditNoteRoundedIcon  />} variant="contained" onClick={handleEditRole}> Cập nhật</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}