import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import AddressOption from "../components/AddressOption";
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { User } from "../utils/DataType";
import { currentUser } from "../utils/DataExample";
type Props = {
    isEdit: boolean
}
export default function PersonalEdit({ isEdit }: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User>(currentUser);
    const address = "Quảng Trị-Hải Lăng-Hải An"

    function onClickSubmit(): void {
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }

    return (
        <div className="personal-edit-detail">
            <div className="grid grid-cols-2 grid-rows-1">
                <div className="personal-edit-group personal-lastname">
                    <label htmlFor="LastName">Họ lót <b>*</b></label>
                    <div className="input-wrapper">
                        <input type="text" name="LastName" id="LastName" disabled={!isEdit} value={user.LastName} />
                    </div>
                </div>

                <div className="personal-edit-group personal-firstname">
                    <label htmlFor="FirstName">Tên <b>*</b></label>
                    <div className="input-wrapper">
                        <input type="text" name="FirstName" id="FirstName" disabled={!isEdit} value={user.FirstName} />
                    </div>
                </div>

                <div className="personal-edit-group personal-email">
                    <label htmlFor="email">Số điện thoại</label>
                    <div className="input-wrapper">
                        <input type="text" name="email" id="email" disabled={!isEdit} value={user.Phone} />
                    </div>
                </div>

                <div className="personal-edit-group personal-phone">
                    <label htmlFor="phone">Giới tính </label>
                    <RadioGroup row className="personal-gender" value={user.Gender} name="Gender">
                        <FormControlLabel value={0} control={<Radio color="success" />} label="Nam" disabled={!isEdit} />
                        <FormControlLabel value={1} control={<Radio color="success" />} label="Nữ" disabled={!isEdit} />
                    </RadioGroup>
                </div>
            </div>
            <div className="personal-edit-group">
                <label htmlFor="">Địa chỉ </label>
                {/* <AddressOption disabled={!isEdit} isEdit={true} address={address} /> */}
            </div>
            <div className="grid grid-cols-2 grid-rows-1">
                <div className="personal-edit-group personal-phone">
                    <label htmlFor="phone" >Địa chỉ chi tiết</label>
                    <div className="input-wrapper">
                        <input type="text" name="phone" id="phone" disabled={!isEdit} value={user.Address} />
                    </div>
                </div>
                <div className="personal-edit-group personal-phone">
                    <label htmlFor="phone">Email</label>
                    <div className="input-wrapper">
                        <input type="text" name="phone" id="phone" disabled={!isEdit} value={user.Email} />
                    </div>
                </div>
            </div>
            <div className="personal-edit--button">
                <LoadingButton sx={{
                    backgroundColor: '#7e57c2', '&:hover': {
                        backgroundColor: '#7e57c2'
                    },
                    '&:disabled': {
                        backgroundColor: '#b39ddb',
                        color: 'white'
                    }
                }}
                    startIcon={<SaveAsRoundedIcon />}
                    variant="contained"
                    loading={isLoading}
                    onClick={onClickSubmit}
                    loadingPosition="start"
                    disabled={!isEdit}>
                    <span> Lưu thông tin</span>
                </LoadingButton>
            </div>
        </div>
    )
}