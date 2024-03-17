import '../styles/personal.css'
import avatar from '../assets/images/icon/avatar-boy.png';
import PatternRoundedIcon from '@mui/icons-material/PatternRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';
import { setShowModal } from '../redux/store/PasswordSlice';
import PersonalEdit from '../layouts/PersonalEdit';
import { useState } from 'react';
import DoNotDisturbAltRoundedIcon from '@mui/icons-material/DoNotDisturbAltRounded';
import { Button } from '@mui/material';

export function Personal() {
    const dispatch: AppDispatch = useDispatch();
    const [isEdit, setIsEdit] = useState<boolean>(false);

    function onClickEditButton(): void {
        setIsEdit(!isEdit);
    }

    const onClickPasswordButton = () => {
        dispatch(setShowModal(true));
    }

    return (
        <section id='personal'>
            <div className="personal-main">
                <div className="personal-show">
                    <div className="personal-avatar">
                        <img src={avatar} alt="avatar" />
                    </div>
                    <div className="personal-detail">

                        <div className="personal-general">
                            <div className="personal-detail--name">Phan Thanh Thắng</div>
                            <div className="personal-detail--id">311941401</div>
                        </div>
                        <div className="personal-row personal-email">
                            <label htmlFor="">Email: </label>
                            <div className="email">thanhthang.itsgu@gmail.com</div>
                        </div>
                        <div className="personal-row  personal-role">
                            <label htmlFor="">Chức vụ: </label>
                            <div className="role">Admin</div>
                        </div>
                        <div className="personal-row">
                            <label htmlFor="">Giới tính: </label>
                            <div className="role">Nam</div>
                        </div>
                        <div className="personal-button">
                            <Button variant="contained" onClick={onClickPasswordButton} startIcon={<PatternRoundedIcon />} className='personal-button'>
                                Đổi mật khẩu
                            </Button>
                            {!isEdit ?
                                <Button variant="contained" onClick={onClickEditButton} startIcon={<BorderColorRoundedIcon />} color="success" className='personal-button'>
                                    Sửa thông tin
                                </Button> :
                                <Button variant="contained" onClick={onClickEditButton} startIcon={<DoNotDisturbAltRoundedIcon />}
                                    color="success" className='personal-button'
                                    sx={{
                                        backgroundColor: '#9e9e9e', '&:hover': {
                                            backgroundColor: '#757575'
                                        },
                                        '&:disabled': {
                                            backgroundColor: '#9e9e9e',
                                            color: 'white'
                                        }
                                    }}>
                                    Hủy chỉnh sửa
                                </Button>}
                        </div>
                    </div>
                </div>
                <div className="personal-edit">
                    <PersonalEdit isEdit={isEdit} />
                </div>
            </div>
        </section>
    )
}