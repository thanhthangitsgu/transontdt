import { Checkbox, Chip, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Pagination, Radio, RadioGroup, Select, SelectChangeEvent, Tooltip } from '@mui/material';
import '../../styles/account.css'
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import Table from '../../components/table/Table';
import { MouseEventHandler, ReactNode, useEffect, useState } from 'react';
import PopupAddAccount from './PopupAddAccount';
import useGet from '../../hook/useGet';
import { ConfigColumn, Position, RoleType } from '../../utils/DataType';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import PopupConfirm from './PopupConfirm';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import NoEncryptionOutlinedIcon from '@mui/icons-material/NoEncryptionOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import AxiosClient from '../../api/AxiosClient';
import UntilsFunction from '../../utils/UtilsFunction';
import ViewAccount from './ViewAccount';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type Page = {
    current: number,
    total: number,
    limit: number
}

function getChip(isActive: boolean, isConfirm: boolean): ReactNode {
    if (isActive) return <Chip label="Active" sx={{ color: '#00b0ff', borderColor: '#00b0ff' }} variant="outlined" size="small" />;
    if (!isConfirm) return <Chip label="Pending" color="secondary" variant="outlined" size="small" />
    return <Chip label="Banned" color="error" variant="outlined" size="small" />
}

function getRow(id: string, email: string, role: string, chip: ReactNode, action: ReactNode): ConfigColumn[] {
    return [
        { element: id, position: Position.Left },
        { element: <span>{email}</span>, position: Position.Left },
        { element: <span>{role}</span>, position: Position.Left },
        { element: action, position: Position.Center }
    ];
}

function getAction(isActive: boolean, isConfirm: boolean, action: MouseEventHandler[], isDisable: boolean): ReactNode {
    if (isActive) return <IconButton color="warning" onClick={action[0]} disabled={isDisable}><LockPersonOutlinedIcon /></IconButton>
    if (!isConfirm) return <IconButton color="secondary" onClick={action[1]} disabled={isDisable}><HowToRegOutlinedIcon /></IconButton>;
    return <IconButton color="primary" onClick={action[2]} disabled={isDisable} ><NoEncryptionOutlinedIcon /></IconButton>
}

export default function Account() {
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [listAccount, setListAccount] = useState<Array<any>>([]);
    const [openPopupAdd, setOpenPopupAdd] = useState<boolean>(false);
    const [openPopupDelete, setOpenPopupDelete] = useState<boolean>(false);
    const [openPopupBan, setOpenPopupBan] = useState<boolean>(false);
    const [openPopupUnlock, setOpenPopupUnlock] = useState<boolean>(false);
    const [openPopupAccept, setOpenPopupAccept] = useState<boolean>(false);
    const [openPopupDeletes, setOpenPopupDeletes] = useState<boolean>(false);
    const [openPopupView, setOpenPopupView] = useState<boolean>(false);
    const [idView, setIdView] = useState<string>('');
    const [listDelete, setListDelete] = useState<Array<string>>([]);
    const [listDeletes, setListDeletes] = useState<Array<string>>([]);
    const [isAddDelete, setIsAddDelete] = useState<boolean>(false);
    const [listStatusCheck, setListStatusCheck] = useState<boolean[]>([true]);
    const [checkAll, setCheckAll] = useState<boolean>(false);
    const configWidth = [5, 25, 30, 15, 30, 10];
    const [search, setSearch] = useState<string>('');
    const [listRole, setListRole] = useState<RoleType[]>([]);
    const [filterRole, setFilterRole] = useState<number>(0);
    let auth = useSelector<RootState, number>(state => state.auth);
    const [statusRole, setStatusRole] = useState<number[]>([0, 0, 0, 0]);

    const dataStatusRole = useGet(`get-permission?object=account&role=${auth}`, false);

    useEffect(() => {
        if (!dataStatusRole.response) return;
        let list: any[] = dataStatusRole.response;
        let temp = [...statusRole]
        for (let i = 0; i < 4; i++) {
            let el = list.find((item) => item === i + 1);
            if (el) temp[i] = el;
        };
        setStatusRole(temp);
    }, [dataStatusRole.response])

    const [page, setPage] = useState<Page>({
        current: 1,
        total: 1,
        limit: 10
    });


    let res = useGet(`/accounts?search=${search}&page=${page.current}&size=${page.limit}${filterRole ? `&role=${filterRole}` : ``}`, false);
    let dataRole = useGet('/roles', false);

    //Handle click button filter
    const onClickButtonFillter = () => {
        setOpenFilter(!openFilter);
    }

    useEffect(() => {
        if (!dataRole.response) return;
        setListRole(dataRole.response);
    }, [dataRole.response])

    function onChangeCheckAll(event: React.ChangeEvent<HTMLInputElement>) {
        let tempCheck = [...listStatusCheck];
        let temp: string[] = [];
        if (event.target.checked) {
            listAccount.map((item) => temp.push(item[0].element));
            tempCheck.fill(true, 0, tempCheck.length);
        } else {
            tempCheck.fill(false, 0, tempCheck.length);
        };
        setListDeletes(temp);
        setListStatusCheck(tempCheck);
    };

    let columns: ConfigColumn[] = [
        { element: <Checkbox sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} checked={checkAll} onChange={onChangeCheckAll} />, position: Position.Left },
        { element: <span>ID</span>, position: Position.Left },
        { element: <span>Email</span>, position: Position.Left },
        { element: <span>Chức vụ</span>, position: Position.Left },
        { element: <span>Tác vụ</span>, position: Position.Center },
    ];


    /**
     * @param email 
     * @param role_id 
     * @param id 
     * @returns 
     */
    function addAccount(email: string, role_id: number, id: string): void {
        let temp = [...listAccount];
        let listRole = [];
        if (!dataRole.response) return;
        for (let el of dataRole.response) listRole.push(el);

        let action =
            <div>
                <IconButton aria-label="delete" color="success" onClick={() => {
                    setOpenView(true);
                    setIdView(id)
                }}><RemoveRedEyeOutlinedIcon /></IconButton>
                <IconButton aria-label="delete" color="error" onClick={() => openDeleteAccount(id)}><DeleteOutlineOutlinedIcon /></IconButton>
            </div>

        let row = getRow(id, email, listRole.find((item) => item.id === role_id).name, getChip(true, true), action);
        temp.unshift(row);
        setListAccount(temp);
    };

    /**
     * @param id 
     */
    function openDeleteAccount(id: string): void {
        let temp = [...listDelete];
        temp.push(id);
        setListDelete(temp);
        setOpenPopupDelete(true);
    }

    /**
     * 
     * @param id 
     */
    function openBanAccount(id: string): void {
        let temp = [...listDelete];
        temp.push(id);
        setListDelete(temp);
        setOpenPopupBan(true);
    }
    /**
     * @param id 
     */
    function openUnlockAccount(id: string): void {
        let temp = [...listDelete];
        temp.push(id);
        setListDelete(temp);
        setOpenPopupUnlock(true);
    }

    function openAccept(id: string): void {
        let temp = [...listDelete];
        temp.push(id);
        setListDelete(temp);
        setOpenPopupAccept(true);
    }

    /**
     * @param cbBefore 
     * @param cbAfter 
     */
    async function deleteAccount(cbBefore: Function, cbAfter: Function, list?: string[]): Promise<void> {
        cbBefore();

        let temp = list ? list : listDelete;
        let tempAccount = [...listAccount];
        let count: number = 0;
        //Delete
        for (let id of temp) {
            await AxiosClient.delete(`/accounts/${id}`).catch((e) => { });
            count++;
            let index = tempAccount.find((item) => item[0].element !== id);
            tempAccount.splice(index, 1);

        }
        setListAccount(tempAccount);
        let message = count === 1 ? `Xóa tài khoản thành công!` : `${count} tài khoản đã được xóa!`
        UntilsFunction.showToastSuccess(message);
        cbAfter();
    };
    /**
     * @param cbBefore 
     * @param cbAfter 
     */
    function banAccount(cbBefore: Function, cbAfter: Function): void {
        cbBefore();

        //Delete
        listDelete.map(async (id) => {
            await AxiosClient.put(`/accounts/${id}`, { is_active: false }).catch((e) => { });
            let temp = [...listAccount];
            let el = temp.filter((item) => item[0].element == id)[0];
            el[3].element = getChip(false, true);
            el[4].element =
                <div>
                    <IconButton aria-label="delete" color="success" onClick={() => {
                        setOpenView(true);
                        setIdView(id)
                    }}><RemoveRedEyeOutlinedIcon /></IconButton>
                    <IconButton aria-label="delete" color="error" onClick={() => openDeleteAccount(id)}><DeleteOutlineOutlinedIcon /></IconButton>
                </div>
            setListAccount(temp);
        });

        //Show message
        UntilsFunction.showToastSuccess('Khóa tài khoản thành công!')
        cbAfter();
    }
    /**
     * @param cbBefore 
     * @param cbAfter 
     */
    function unLockAccount(cbBefore: Function, cbAfter: Function): void {
        cbBefore();

        //Delete
        listDelete.map(async (id) => {
            await AxiosClient.put(`/accounts/${id}`, { is_active: true }).catch((e) => { });
            let temp = [...listAccount];
            let el = temp.filter((item) => item[0].element == id)[0];
            el[3].element = getChip(true, true);
            el[4].element =
                <div>
                    <IconButton color="success" ><RemoveRedEyeOutlinedIcon /></IconButton>
                    <IconButton color="error" onClick={() => openDeleteAccount(id)}><DeleteOutlineOutlinedIcon /></IconButton>
                </div>
            setListAccount(temp);
        });

        //Show message
        UntilsFunction.showToastSuccess('Mở khóa tài khoản thành công!')
        cbAfter();
    }

    function acceptAccount(cbBefore: Function, cbAfter: Function): void {
        cbBefore();

        //Accept
        listDelete.map(async (id) => {
            await AxiosClient.put(`/accounts/${id}`, { is_active: true, is_confirm: true }).catch((e) => { });
            let temp = [...listAccount];
            let el = temp.filter((item) => item[0].element == id)[0];
            el[3].element = getChip(true, true);
            el[4].element =
                <div>
                    <IconButton aria-label="delete" color="success" onClick={() => {
                        setOpenView(true);
                        setIdView(id)
                    }}><RemoveRedEyeOutlinedIcon /></IconButton>
                    <IconButton color="error" onClick={() => openDeleteAccount(id)}><DeleteOutlineOutlinedIcon /></IconButton>
                </div>
            setListAccount(temp);
        });

        //Show message
        UntilsFunction.showToastSuccess('Phê duyệt tài khoản thành công!')
        cbAfter();
    }

    useEffect(() => {
        //Get list role
        let listRole = [];
        if (dataRole.response) for (let el of dataRole.response) listRole.push(el);
        else return;

        //Get list account
        let temp = [];
        setPage({ ...page, total: res.total });

        if (res.response) for (let el of res.response) {
            el.is_active = parseInt(el.is_active);
            el.is_confirm = parseInt(el.is_confirm);
            el.role_id = parseInt(el.role_id);
            let action =
                <div>
                    <IconButton aria-label="delete" color="success" onClick={() => {
                        setOpenView(true);
                        setIdView(el.id)
                    }}><RemoveRedEyeOutlinedIcon /></IconButton>
                  
                    <IconButton aria-label="delete" color="error" onClick={() => openDeleteAccount(el.id)} disabled={isAddDelete}><DeleteOutlineOutlinedIcon /></IconButton>
                </div>
            let row: ConfigColumn[] = getRow(el.id, el.email, listRole.find((item) => item.id === el.role_id).name, getChip(el.is_active, el.is_confirm), action);
            temp.push(row);
        }
        setListAccount(temp);
    }, [res.response, dataRole.loading]);

    /**
     * Delete more rows
     */
    function handleChangeListDeletes(): void {
        let temp = [...listAccount];
        for (let el of temp) {
            let id = el[0].element;
            let label = el[3].element.props.label;

            let is_active = (label === 'Active');
            let is_confirm = (label !== 'Pending');

            el[4].element =
                <div>
                    <IconButton aria-label="delete" color="success" onClick={() => {
                        setOpenView(true);
                        setIdView(id)
                    }}><RemoveRedEyeOutlinedIcon /></IconButton>
                    {getAction(is_active, is_confirm, [() => openBanAccount(id), () => openAccept(id), () => openUnlockAccount(id)], listDeletes.length > 0)}
                    <IconButton aria-label="delete" disabled={listDeletes.length > 0} color="error" onClick={() => openDeleteAccount(id)}><DeleteOutlineOutlinedIcon /></IconButton>
                </div>
        }

        setListAccount(temp);
    }

    useEffect(() => {
        handleChangeListDeletes();
        if (listDeletes.length !== listAccount.length || listDeletes.length === 0) {
            setCheckAll(false);
        }
        else setCheckAll(true);

        if (listDeletes.length === 0) {
            setCheckAll(false);
            let tempCheck = [...listStatusCheck];
            tempCheck.fill(false, 0, tempCheck.length);
            setListStatusCheck(tempCheck);
        }
    }, [listDeletes]);

    function addDeletes(id: string, isAdd: boolean): void {
        let temp = [...listDeletes];
        if (isAdd) temp.push(id);
        else temp = listDeletes.filter((el) => el !== id)

        setListDeletes(temp);
    }

    useEffect(() => {
        let temp = [];
        for (let i = 0; i < listAccount.length; i++) temp.push(false);
        setListStatusCheck(temp);
    }, [listAccount.length]);

    function setOpenView(open: boolean): void {
        setOpenPopupView(open);
    }

    function onChangePage(event: React.ChangeEvent<unknown>, value: number) {
        setPage({ ...page, current: value });
        console.log(value);
    }

    function onChangeLimit(event: SelectChangeEvent<unknown>) {
        setPage({ ...page, limit: parseInt(`${event.target.value}`), current: 1 });
    }

    function onChangeSearch(event: React.FormEvent<HTMLInputElement>): void {
        setSearch(event.currentTarget.value);
        setPage({ ...page, limit: 10, current: 1 });
    }

    function onChangeRole(event: SelectChangeEvent<number>) {
        setFilterRole(parseInt(`${event.target.value}`));
    }

    return (
        <div className="account-page">
            <div>
                <PopupAddAccount open={openPopupAdd} setOpen={setOpenPopupAdd} addAccount={addAccount} />
                <PopupConfirm title='Xóa tài khoản' message='Bạn có chắc chắn muốn xóa tài khoản này?' listDelete={listDelete} action={deleteAccount} open={openPopupDelete} setOpen={setOpenPopupDelete} setListDelete={setListDelete} />
                <PopupConfirm title='Khóa tài khoản' message='Bạn có chắc chắn muốn khóa tài khoản này?' listDelete={listDelete} action={banAccount} open={openPopupBan} setOpen={setOpenPopupBan} setListDelete={setListDelete} />
                <PopupConfirm title='Mở khóa tài khoản' message='Bạn có chắc chắn muốn mở khóa tài khoản này?' listDelete={listDelete} action={unLockAccount} open={openPopupUnlock} setOpen={setOpenPopupUnlock} setListDelete={setListDelete} />
                <PopupConfirm title='Phê duyệt tài khoản' message='Bạn có chắc chắn phê duyệt tài khoản này?' listDelete={listDelete} action={acceptAccount} open={openPopupAccept} setOpen={setOpenPopupAccept} setListDelete={setListDelete} />
                <PopupConfirm title='Xóa tài khoản' message={`Bạn có chắc chắn muốn xóa ${listDeletes.length} tài khoản này?`} listDelete={listDeletes} action={deleteAccount} open={openPopupDeletes} setOpen={setOpenPopupDeletes} setListDelete={setListDeletes} />
                <ViewAccount id={idView} open={openPopupView} setOpen={setOpenView} />
            </div>

            <div className="account-page__content">
                <div className="account-page-main">
                    <div className="account-page__header">
                        <div className="account-page__search-bar">
                            <button>
                                <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
                                    <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </button>
                            <input className="input" placeholder="Tìm kiếm..." type="text" value={search} onChange={onChangeSearch} />
                            <button className="reset" type="reset">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>

                        </div>
                        <div className="account__action">
                            <IconButton onClick={onClickButtonFillter} sx={{ color: openFilter ? '#bf360c' : '#424242' }}>
                                <FilterListRoundedIcon />
                            </IconButton>
                            {statusRole[1] > 0 && (
                                <IconButton
                                    sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1976d2' }, }} size='small'
                                    onClick={() => setOpenPopupAdd(true)}>
                                    <AddRoundedIcon />
                                </IconButton>
                            )}
                        </div>
                    </div>
                    <div style={{ height: openFilter ? '4rem' : 0, marginTop: openFilter ? '0' : '1rem' }} className="table-option"  >
                        <div className="table-filter">
                            <div className="table-option--filter flex gap-8">
                                <FormControl fullWidth sx={{ marginBottom: '1rem' }}  >
                                    <InputLabel id='province' className="title-select">Chức vụ</InputLabel>
                                    <Select
                                        label="Chức vụ"
                                        className="select-address"
                                        sx={{ height: '2rem', width: '8rem' }}
                                        value={filterRole}
                                        onChange={onChangeRole}
                                    >
                                        <MenuItem value={0}>All</MenuItem>
                                        {listRole.map((item, index) => <MenuItem value={item.id}>{item.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth sx={{ marginBottom: '1rem' }}  >
                                    <InputLabel id='province' className="title-select">Trạng thái</InputLabel>
                                    <Select
                                        label="Trạng thái"
                                        className="select-address"
                                        sx={{ height: '2rem', width: '8rem' }}
                                        value={filterRole}
                                        onChange={onChangeRole}
                                    >
                                        <MenuItem value={0}>All</MenuItem>
                                        <MenuItem value={1}>Active</MenuItem>
                                        <MenuItem value={2}>Banned</MenuItem>
                                        <MenuItem value={3}>Pending</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="table-sort">
                        </div>

                    </div>
                    <div className="account-list" style={{ height: openFilter ? 'calc(100% - 6.5rem)' : 'calc(100% - 3.5rem)' }}>
                        <Table
                            configWidth={configWidth}
                            columns={columns} rows={listAccount}
                            isLoad={res.loading}
                            listDelete={listDeletes} setListDelete={addDeletes}
                            listStatusCheck={listStatusCheck} setListStatusCheck={setListStatusCheck}
                            isCheckAll={checkAll}
                            setOpenPopupDeletes={setOpenPopupDeletes}
                            isCheck={true}
                        />
                    </div>
                </div>
                <div className="pagination">
                    <div className="pagination-row">
                        <span>Tối đa</span>
                        <Select
                            defaultValue={10}
                            sx={{ height: '2rem' }}
                            className='pagination-row--select'
                            value={page.limit}
                            onChange={onChangeLimit}
                        >
                            <MenuItem value={10} >10</MenuItem>
                            <MenuItem value={30} >30</MenuItem>
                            <MenuItem value={50} >50</MenuItem>
                        </Select>
                        <span>hàng</span>
                    </div>
                    <div className="pagination-list">
                        <Pagination count={page.total} defaultPage={1} page={page.current} siblingCount={0} boundaryCount={1} onChange={onChangePage} />
                    </div>
                </div>
            </div>
        </div>
    )
}   