import logo from "../../assets/images/tdt.png";
import MenuItem from "./MenuItem";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../../redux/store/TitleSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { Button, Tooltip } from "@mui/material";
import { LecturerType, PermissionRole } from "../../utils/DataType";
import { useEffect, useState } from "react";
import useGet from "../../hook/useGet";

export default function Navbar({ isOpen }: { isOpen: boolean }) {
    const dispatch: AppDispatch = useDispatch();
    const profile = useSelector<RootState, LecturerType>(state => state.profile);
    let auth = useSelector<RootState, number>(state => state.auth);
    const [listPermission, setList] = useState<PermissionRole[]>([]);

    const data = useGet(`permission-role/${auth}`, false);

    const handleClickItemMenu = (title: string) => {
        dispatch(setTitle(title));
    }

    useEffect(() => {
        if (!data.response) return;
        let temp: any[] = data.response;
        let list: PermissionRole[] = [];
        temp.map((item) => {
            let permission_id = parseInt(item.permission_id);
            let role_id = parseInt(item.role_id);
            list.push({ permission_id, role_id });
        });

        setList(list);
    }, [data.response]);

    useEffect(() => {
        console.log(listPermission);
    }, [listPermission]);

    function isShow(index: number): boolean {
        if (index === -1 && auth === 1) return true;
        if (index === 0) return true;
        for (let item of listPermission) {
            if (Math.ceil(item.permission_id / 4) === index && item.permission_id % 4 === 1) return true;
        }
        return false;
    }

    return (
        <div className={isOpen ? "navbar" : "navbar navbar--close"}>
            <div className="navbar__logo flex justify-center items-center">
                <div className="navbar__logo-container">
                    <img src={logo} alt="Logo Đại học sài Gòn" />
                </div>
            </div>
            <div className="navbar__list-item">
                {MenuItem.map((item, index) => {
                    if (isShow(item.index))
                        return (
                            <div className="navbar__item" key={index}>
                                <NavLink to={`/${item.slug}`} onClick={() => handleClickItemMenu(item.name)}
                                    className={({ isActive }) => isActive ? 'item__button--active' : ''}>
                                    <Tooltip title={isOpen ? '' : item.name} placement="right">
                                        <Button variant="text" className={index === 0 ? "item__button" : "item__button"}>
                                            <div className="navbar__item-icon">{item.icon}</div>
                                            <div className="navbar__item-name">{item.name}</div>
                                        </Button>
                                    </Tooltip>
                                </NavLink>
                            </div>
                        )
                })}
            </div>
        </div>
    );
}
