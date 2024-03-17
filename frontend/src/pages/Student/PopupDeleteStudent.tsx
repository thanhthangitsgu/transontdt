import { Button, CircularProgress, Dialog, DialogContent, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import { useState } from "react";
import AxiosClient from "../../api/AxiosClient";
import UntilsFunction from "../../utils/UtilsFunction";
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} timeout={50000} {...props} />;
});
type props = {
    open: boolean,
    setOpen: Function,
    deleteStudent: Function,
    listDelete: string[],
}

export default function PopupDeleteStudent({ open, setOpen, deleteStudent, listDelete }: props) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function closePopup(): void {
        setOpen(false);
    }

    async function _deleteStudent(): Promise<void> {
        for (let id of listDelete) {
            await AxiosClient.delete(`students/${id}`);
        };

        UntilsFunction.showToastSuccess('Xóa giảng viên thành công!');
        deleteStudent(listDelete);
        closePopup();
    }
    return (
        <div className="popup-confirm">
            <Dialog
                open={open}
                keepMounted
                TransitionComponent={Transition}
                onClose={() => closePopup()}
                fullWidth={true}
                maxWidth='xs'
            >
                <DialogContent className="dialog-account">
                    <div className="dialog-add-account">
                        <div className="dialog-account--title">Xóa sinh viên</div>
                        <div className="dialog-account-content">
                            Bạn có chắc chắn muốn xóa sinh viên này?
                        </div>
                        <div className="dialog-account-action">
                            <Button color="error"> HỦY</Button>
                            {isLoading ? <Button><CircularProgress size={25} /> </Button> : <Button onClick={_deleteStudent}> XÁC NHẬN</Button>}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}