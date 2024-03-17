
import { CircularProgress, FormControl, IconButton, InputLabel, Menu, MenuItem, Select, SelectChangeEvent, Tooltip } from "@mui/material";
import { Checkbox } from "@mui/material"
import Table from "../../components/table/Table";
import { ConfigColumn, Position, RoleType } from "../../utils/DataType";
import { useEffect, useState } from "react";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import AddRole from "./AddRole";
import DeleteRole from "./DeleteRole";
import useGet from "../../hook/useGet";
import AxiosClient from "../../api/AxiosClient";
import UntilsFunction from "../../utils/UtilsFunction";
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import EditRole from "./EditRole";

type PopupStatus = {
    add: boolean,
    delete: boolean,
    edit: boolean
}
const initPopupStatus: PopupStatus = {
    add: false,
    delete: false,
    edit: false
}

export default function Role() {
    const [listRow, setListRow] = useState<ConfigColumn[][]>([]);
    const [statusPopup, setStatusPopup] = useState<PopupStatus>(initPopupStatus);
    const [listStatusCheck, setListStatusCheck] = useState<boolean[]>([]);
    const [checkAll, setCheckAll] = useState<boolean>(false);
    const [listRole, setListRole] = useState<RoleType[]>([]);
    const [permission, setPermission] = useState<RoleType[]>([]);
    const [selectRole, setSelectRole] = useState<number>(1);
    const [listCheckPermision, setListCheck] = useState<boolean[]>([]);
    const [isLoad, setIsLoad] = useState<boolean[]>([]);

    let dataRole = useGet('roles', false);
    let dataPermission = useGet('permissions', false);

    const configWidth = [20, 15, 15, 15, 15, 20];

    //Defind colums
    let columns: ConfigColumn[] = [
        { element: <span>Đối tượng</span>, position: Position.Center },
        { element: <span>Xem</span>, position: Position.Center },
        { element: <span>Thêm</span>, position: Position.Center },
        { element: <span>Sửa</span>, position: Position.Center },
        { element: <span>Xóa</span>, position: Position.Center },
        { element: <span>Tác vụ</span>, position: Position.Center },
    ];

    useEffect(() => {
        setListRow(getRow(getListObject(permission)));
    }, [isLoad])

    useEffect(() => {
        getPermissionRole(selectRole);
    }, [selectRole])

    useEffect(() => {
        if (listCheckPermision.length) setListRow(getRow(getListObject(permission)));
    }, [listCheckPermision])

    //Get list role
    useEffect(() => {
        dataRole.response && setListRole(dataRole.response);
    }, [dataRole.loading]);

    //Re render permission
    useEffect(() => {
        dataPermission.response && setPermission(dataPermission.response);
    }, [selectRole]);

    //Get list permisstion
    useEffect(() => {
        dataPermission.response && setPermission(dataPermission.response);
    }, [dataPermission.loading])

    //Get list object
    function getListObject(listPermision: RoleType[]): string[] {
        let list = [];
        for (let i = 0; i < listPermision.length; i += 4) {
            let name = listPermision[i].name.split('_');
            name.shift();
            list.push(capitalize(name.join(' ')));
        };
        return list;
    }

    /**
     * 
     * @param listPermision List permission
     * @returns Row rendered
     */
    function getRow(listPermision: string[]): ConfigColumn[][] {
        let rows: ConfigColumn[][] = [];
        listPermision.map((item, index) => {
            let row = [
                { element: <span>{item}</span>, position: Position.Center },
                { element: <span>{isLoad[index * 4] && <CircularProgress size={20} />}{!isLoad[index * 4] && <Checkbox onChange={() => handleChangeCheckbox(index * 4)} checked={getValueCheck(index * 4)} />}</span>, position: Position.Center },
                { element: <span>{isLoad[index * 4 + 1] && <CircularProgress size={20} />}{!isLoad[index * 4 + 1] && <Checkbox onChange={() => handleChangeCheckbox(index * 4 + 1)} checked={getValueCheck(index * 4 + 1)} />}</span>, position: Position.Center },
                { element: <span>{isLoad[index * 4 + 2] && <CircularProgress size={20} />}{!isLoad[index * 4 + 2] && <Checkbox onChange={() => handleChangeCheckbox(index * 4 + 2)} checked={getValueCheck(index * 4 + 2)} />}</span>, position: Position.Center },
                { element: <span>{isLoad[index * 4 + 3] && <CircularProgress size={20} />}{!isLoad[index * 4 + 3] && <Checkbox onChange={() => handleChangeCheckbox(index * 4 + 3)} checked={getValueCheck(index * 4 + 3)} />}</span>, position: Position.Center },
                {
                    element: <div>
                        <IconButton color="success" onClick={() => checkAllPermission(index * 4)} ><ChecklistRoundedIcon /></IconButton>
                        <IconButton color="error" onClick={() => removeAllPermission(index * 4)}><DeleteOutlineOutlinedIcon /></IconButton>
                    </div>, position: Position.Center
                },
            ];
            rows.push(row);
        })
        return rows;
    }

    //Add all permission
    async function checkAllPermission(row: number): Promise<void> {
        let temp = [...listCheckPermision];
        let tempLoad = [...isLoad];

        for (let i = 0; i < 4; i++) tempLoad[row + i] = true;
        setIsLoad(tempLoad);

        for (let i = 0; i < 4; i++) {
            if (!listCheckPermision[row + i]) {
                await AxiosClient.post('permission-role', { role_id: selectRole, permission_id: row + i + 1 });
                temp[row + i] = true;
                tempLoad[row + i] = false;
            } else {
                tempLoad[row + i] = false;
            }
        };
        setListCheck(temp);
        setIsLoad(tempLoad);
    }

    //Remove all permission
    async function removeAllPermission(row: number): Promise<void> {
        let temp = [...listCheckPermision];
        let tempLoad = [...isLoad];

        for (let i = 0; i < 4; i++) tempLoad[row + i] = true;
        setIsLoad(tempLoad);

        for (let i = 0; i < 4; i++) {
            if (listCheckPermision[row + i]) {
                await AxiosClient.delete(`permission-role/delete`, { data: { role_id: selectRole, permission_id: row + i + 1 } });
                temp[row + i] = false;
                tempLoad[row + i] = false;
            } else {
                tempLoad[row + i] = false;
            }
        };
        setListCheck(temp);
        setIsLoad(tempLoad);
    }

    function getValueCheck(index: number): boolean {
        if (listCheckPermision[index] === undefined || listCheckPermision[index] === null) return false;
        return listCheckPermision[index] === true;
    }

    function setValueCheck(index: number): void {
        let temp = [...listCheckPermision];
        temp[index] = !temp[index];
        setListCheck(temp);
    }

    async function handleChangeCheckbox(id: number): Promise<void> {
        let status = !getValueCheck(id);
        let temp = [...isLoad];
        temp[id] = true;
        setIsLoad(temp);

        function handleChanging(): void {
            setValueCheck(id);
            let temp = [...isLoad];
            temp[id] = false;
            setIsLoad(temp);
        }

        if (status) {
            await AxiosClient.post('permission-role', { role_id: selectRole, permission_id: id + 1 });
            handleChanging();
        } else {
            await AxiosClient.delete(`permission-role/delete`, { data: { role_id: selectRole, permission_id: id + 1 } });
            handleChanging();
        }
    }

    function openPopupAdd(open: boolean): void {
        setStatusPopup({ ...statusPopup, add: open });
    }

    function openPopupDelete(open: boolean): void {
        setStatusPopup({ ...statusPopup, delete: open });
    }

    function openPopupEdit(open: boolean): void {
        setStatusPopup({ ...statusPopup, edit: open });
    }

    useEffect(() => {
        getPermissionRole(selectRole);
    }, [permission]);

    function getPermissionRole(role: number): void {
        let temp: boolean[] = new Array(permission.length);
        let load: boolean[] = new Array(permission.length);
        temp.fill(false, 0, temp.length);
        load.fill(false, 0, load.length);

        AxiosClient.get(`permission-role/${role}`).then((data) => {
            let list: any[] = data.data.data;
            list.map((item) => {
                temp[item.permission_id - 1] = true;
            });
            setListCheck(temp);
            setIsLoad(load);
        });
    }

    function handleChange(event: SelectChangeEvent<number>) {
        setSelectRole(parseInt(`${event.target.value}`));
    };

    // capitalize word
    const capitalize = (str: string, lower = false) =>
        (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());

    function addRole(role: RoleType): void {
        let temp = [...listRole];
        temp.push(role);
        setListRole(temp);
        setSelectRole(role.id);
    }

    function deleteRole(): void {
        AxiosClient.delete(`roles/${selectRole}`).then(() => {
            let temp = listRole.filter((role) => role.id !== selectRole);
            setListRole(temp);
            setSelectRole(temp[0].id);

            setStatusPopup({ ...statusPopup, delete: false });
            UntilsFunction.showToastSuccess('Xóa quyền thành công!');
        }).catch(() => {
            UntilsFunction.showToastError('Đã có lỗi xảy ra!');
        })
    }

    function editRole(name: string): void {
        let temp = [...listRole];
        let item = temp.find((item) => item.id === selectRole);
        if (item) item.name = name;
        setListRole(temp);
    }

    function getCurrentNameRole(): string {
        let temp = listRole.find((item) => item.id === selectRole);
        if (temp) return temp.name;
        return '';
    }

    return (
        <div className="account-page">
            <AddRole isOpen={statusPopup.add} setOpen={openPopupAdd} addRole={addRole} />
            <DeleteRole isOpen={statusPopup.delete} setOpen={openPopupDelete} deleteRole={deleteRole} />
            <EditRole isOpen={statusPopup.edit} setOpen={openPopupEdit} editRole={editRole} idRole={selectRole} initName={getCurrentNameRole()} />
            <div className="account-page__content">
                <div className="role-header">
                    <FormControl fullWidth sx={{ marginBottom: '1rem' }}  >
                        <InputLabel id='province' className="title-select">Quyền</InputLabel>
                        <Select
                            label="Quyền"
                            className="select-address"
                            sx={{ height: '2.5rem', width: '15rem' }}
                            value={!listRole.length ? 0 : selectRole}
                            onChange={handleChange}
                        >
                            {!listRole.length && (<MenuItem value={0}>loading...</MenuItem>)}
                            {listRole.length && listRole.map((item, index) => <MenuItem value={item.id}>{item.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <div className="role-action">
                        <Tooltip title="Thêm quyền" placement="top" arrow>
                            <IconButton sx={{ backgroundColor: '#388e3c', color: 'white', '&:hover': { backgroundColor: '#2e7d32' } }} size='small' onClick={() => openPopupAdd(true)}>
                                <AddRoundedIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa quyền" placement="top" arrow>
                            <IconButton sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1565c0' } }} size='small' onClick={() => openPopupEdit(true)}>
                                <EditNoteRoundedIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Xóa quyền" placement="top" arrow>
                            <IconButton
                                sx={{ backgroundColor: '#d32f2f', color: 'white', '&:hover': { backgroundColor: '#c62828' }, }} size='small' onClick={() => openPopupDelete(true)}>
                                < DeleteSweepRoundedIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <div className="list-role">
                    <Table
                        configWidth={configWidth}
                        columns={columns} rows={listRow}
                        isLoad={dataPermission.loading}
                        listDelete={[]} setListDelete={() => { }}
                        listStatusCheck={listStatusCheck} setListStatusCheck={setListStatusCheck}
                        isCheckAll={checkAll}
                        setOpenPopupDeletes={() => { }}
                        isCheck={false}
                    />
                </div>
            </div>
        </div>
    )
}