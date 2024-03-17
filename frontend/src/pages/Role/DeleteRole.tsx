import { Button, Dialog, DialogContent } from "@mui/material"
import { Transition } from "../../utils/UtilsFunction"
import InputValid from "../../components/InputValid"
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
type props = {
    isOpen: boolean,
    setOpen: Function,
    deleteRole: Function
}
export default function DeleteRole({ isOpen, setOpen, deleteRole }: props) {

    function handleDeleteRole(): void {
        deleteRole();
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
                <div className="dialog-title">Xóa quyền</div>
                <div className="dialog-content">
                    Bạn có chắc chắc muốn xóa quyền này?
                </div>
                <div className="dialog-action">
                    <Button startIcon={<ThumbUpAltOutlinedIcon />} variant="contained" onClick={handleDeleteRole}> Xác nhận</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}