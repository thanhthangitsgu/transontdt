import { useEffect, useState } from "react";
import IconAccount from "../assets/images/icon/avatar-boy.png";
import IconFemale from '../assets/images/icon/avatar-girl.png'
import { Button, Icon } from "@mui/material";
import SvgSource from "../utils/SvgSource";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setShowModal } from "../redux/store/PasswordSlice";
import { NavLink } from "react-router-dom";
import { FacultyType, LecturerType, RoleType } from "../utils/DataType";
import useGet from "../hook/useGet";
import IconAdmin from '../assets/images/icon/admin.png'
import Profile from "./Profile";
import AxiosAuth from "../api/AxiosAuth";
import UntilsFunction from "../utils/UtilsFunction";

const MenuTask = ({ Child }: { Child: JSX.Element }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const profile = useSelector<RootState, LecturerType>(state => state.profile);
    const auth = useSelector<RootState, number>(state => state.auth);
    const dataRole = useGet('roles', false);
    const dataFaculty = useGet('faculties', false);
    const [listFaculty, setListFaculty] = useState<FacultyType[]>([]);
    const [openPopup, setOpenPopup] = useState<boolean>(false);

    useEffect(() => {
        dataFaculty.response && setListFaculty(dataFaculty.response);
    }, [dataFaculty.response])

    function onClick(): void {
        setIsOpen(!isOpen);
    }
    const dispatch: AppDispatch = useDispatch();

    function getRole(): string {
        if (!dataRole.response) return 'loading...';
        let listRole: RoleType[] = dataRole.response;
        let role = listRole.find((item) => item.id === auth);
        if (!role) return 'Unknown'
        return role.name;
    }

    function logout(): void {
        AxiosAuth.get('logout').then((data) => {
            UntilsFunction.showToastSuccess('Đăng xuất thành công!');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000)
        }).catch((e) => {
            UntilsFunction.showToastError('Đã có lỗi xảy ra');
        })
    }

    return (
        <>
            <Profile isOpen={openPopup} setOpen={setOpenPopup} lecturer={profile} listFaculty={listFaculty} />
            <div onClick={onClick}>
                {Child}
                <div className={isOpen ? "menu-task" : "menu-task hidden"}>
                    <div className="menu-task--account">
                        <div className="account-info">
                            <div className="account-avatar">
                                <img src={auth !== 3 ? IconAdmin : (profile.gender === 'Nữ' ? IconFemale : IconAccount)} alt="" />
                            </div>
                            <div className="account-detail">
                                <div className="account-name font-semibold">{`${profile.last_name} ${profile.first_name}`}</div>
                                <div className="account-id text-sm">{getRole()}</div>
                            </div>
                        </div>
                        <div className="account-setting">

                            {auth === 3 && (
                                <Button variant="text" className="item__button" onClick={() => setOpenPopup(true)}>
                                    <div className="navbar__item-icon">{SvgSource.AccountSVG}</div>
                                    <div className="navbar__item-name">Thông tin cá nhân</div>
                                </Button>
                            )}

                            <Button variant="text" className="item__button" onClick={() => dispatch(setShowModal(true))}>
                                <div className="navbar__item-icon">{SvgSource.PassWordSVG}</div>
                                <div className="navbar__item-name">Đổi mật khẩu</div>
                            </Button>
                            <Button variant="text" className="item__button" onClick={logout}>
                                <div className="navbar__item-icon">{SvgSource.LogoutSVG}</div>
                                <div className="navbar__item-name">Đăng xuất</div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default MenuTask;