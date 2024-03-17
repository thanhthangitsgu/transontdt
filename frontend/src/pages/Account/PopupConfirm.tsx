import { Button, CircularProgress, Dialog, DialogContent, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useState } from "react";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} timeout={50000} {...props} />;
});

type props = {
    listDelete: string[],
    open: boolean;
    setOpen: Function,
    setListDelete: Function,
    action: Function,
    title: string,
    message: string
}

export default function PopupConfirm({ listDelete, open, setOpen, setListDelete, action, title, message }: props) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function deleteAccount(): void {
        action(() => setIsLoading(true), () => {
            setIsLoading(false);
            closePopup();
        }, listDelete);
    };

    function closePopup(): void {
        setListDelete([]);
        setOpen(false)
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
                        <div className="dialog-account--title">{title}</div>
                        <div className="dialog-account-content">
                            {message}
                        </div>
                        <div className="dialog-account-action">
                            <Button color="error"> HỦY</Button>
                            {isLoading ? <Button><CircularProgress size={25} /> </Button> : <Button onClick={deleteAccount}> XÁC NHẬN</Button>}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}