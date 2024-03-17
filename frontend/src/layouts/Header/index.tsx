import IconAccount from "../../assets/images/icon/avatar-boy.png";
import IconButton from "@mui/material/IconButton";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import { Button } from "@mui/material";
import MenuTask from "../../components/MenuTask";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MenuItem from "../NavBar/MenuItem";
import IconAdmin from '../../assets/images/icon/admin.png'
import IconFemale from '../../assets/images/icon/avatar-girl.png'
import { LecturerType } from "../../utils/DataType";
type Props = {
    isOpen: boolean;
    setIsOpen: Function;
};

export function MenuTaskAccount(role: number, icon: string) {
    return (
        <IconButton className="header__account-avatar">
            <img src={role === 3 ? icon : IconAdmin} alt="account avatar" />
        </IconButton>
    )
}

export default function Header({ isOpen, setIsOpen }: Props) {
    const [title, setTitle] = useState<string>('Trang chủ')
    let param = useLocation();
    let menuItem = MenuItem;
    const auth = useSelector<RootState, number>(state => state.auth);
    const profile = useSelector<RootState, LecturerType>(state => state.profile);

    useEffect(() => {
        let title = menuItem.find((item) => `/${item.slug}` === param.pathname)?.name;
        if (!title) title = 'Trang chủ'
        setTitle(title);
    }, [param])


    const handleClickOpen: Function = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="header">
            <Button className="header__open-nav" onClick={() => handleClickOpen()}>
                <div className="header__open-icon" style={{ transform: isOpen ? "scaleX(-1)" : "scaleX(1)" }}>
                    <MenuOpenRoundedIcon />
                </div>
            </Button>
            <div className="header__menu">
                <div className="header__account">
                    <div className="header__menu-task">
                        <MenuTask
                            Child={MenuTaskAccount(auth, profile.gender === 'Nữ' ? IconFemale : IconAccount)}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
