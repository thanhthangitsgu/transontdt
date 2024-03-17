import { Backdrop, Checkbox, CircularProgress, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Pagination, Radio, RadioGroup, Select, SelectChangeEvent, Tooltip } from '@mui/material';
import '../../styles/account.css'
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import Table from '../../components/table/Table';
import { ReactNode, useEffect, useState } from 'react';
import useGet from '../../hook/useGet';
import { ConfigColumn, StudentType, Position, FacultyType, Page } from '../../utils/DataType';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AxiosClient from '../../api/AxiosClient';
import DeleteFaculty from './DeleteFaculty';
import AddFaculty from './AddFaculty';
import ViewFaculty from './ViewFaculty';

type PopupStatus = {
    popupDelete: boolean,
    popupAdd: boolean
    popupDeletes: boolean,
    popupView: boolean,
}

const initPopupStatus: PopupStatus = {
    popupDelete: false,
    popupAdd: false,
    popupDeletes: false,
    popupView: false
}

const empty: FacultyType = {
    id: 0,
    faculty_id: '',
    name: '',
    email: null,
    phone: null,
    is_delete: 0,
    create_at: '',
    update_at: ''
}


function getRow(id_faculty: string, name: string, email: string | null, phone: string | null, action: ReactNode): ConfigColumn[] {
    return [
        { element: id_faculty, position: Position.Center },
        { element: <span>{name}</span>, position: Position.Left },
        { element: <span>{email ? email : 'Chưa cập nhật'}</span>, position: Position.Left },
        { element: <span>{phone ? phone : 'Chưa cập nhật'}</span>, position: Position.Left },
        { element: action, position: Position.Center }
    ];
}

export default function Student() {
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [listRow, setListRow] = useState<ConfigColumn[][]>([]);
    const [statusPopup, setStatusPopup] = useState<PopupStatus>(initPopupStatus);
    const [listDeletes, setListDeletes] = useState<Array<number>>([]);
    const [listDelete, setListDelete] = useState<Array<number>>([]);
    const [listStatusCheck, setListStatusCheck] = useState<boolean[]>([]);
    const [checkAll, setCheckAll] = useState<boolean>(false);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [listFaculty, setListFaculty] = useState<FacultyType[]>([]);
    const [view, setView] = useState<FacultyType>(empty);

    const [page, setPage] = useState<Page>({
        current: 1,
        total: 1,
        limit: 10
    });

    const [search, setSearch] = useState<string>('');
    const dataFaculty = useGet(`faculties?${search.length > 0 ? `search=${search}&` : ``}&page=${page.current}&size=${page.limit}`, false);
    const configWidth = [5, 10, 25, 25, 25, 10];

    useEffect(() => {
        dataFaculty.response && setListFaculty(dataFaculty.response);
        if (dataFaculty.response) setPage({ ...page, total: dataFaculty.total });
    }, [dataFaculty.response])

    function getListRow(disable: boolean): void {
        let rows: ConfigColumn[][] = [];
        for (let faculty of listFaculty) {
            let action =
                <div>
                    <IconButton color="success" onClick={() => onView(faculty.id)}><RemoveRedEyeOutlinedIcon /></IconButton>
                    <IconButton color="error" onClick={() => openPopupDelete(true, faculty.id)} disabled={disable}><DeleteOutlineOutlinedIcon /></IconButton>
                </div>
            rows.push(getRow(faculty.faculty_id, faculty.name, faculty.email, faculty.phone, action));
        };
        setListRow(rows);
    }

    useEffect(() => {
        getListRow(false);
    }, [listFaculty]);

    function onView(id: number): void {
        setIsLoad(true);
        AxiosClient.get(`faculties/${id}`).then((response) => {
            setIsLoad(false);
            setView(response.data.data);
            setStatusPopup({ ...statusPopup, popupView: true });
        })
    }

    //Handle delete rows
    function onChangeCheckAll(event: React.ChangeEvent<HTMLInputElement>) {
        let tempCheck = [...listStatusCheck];
        let temp: number[] = [];

        if (event.target.checked) {
            listFaculty.map((item) => temp.push(item.id));
            tempCheck.fill(true, 0, tempCheck.length);
        } else {
            tempCheck.fill(false, 0, tempCheck.length);
        };
        setListDeletes(temp);
        setListStatusCheck(tempCheck);
    };

    useEffect(() => {
        setCheckAll(!(listDeletes.length !== listFaculty.length || listDeletes.length === 0));
        if (listDeletes.length === 0) {
            setCheckAll(false);
            let tempCheck = [...listStatusCheck];
            tempCheck.fill(false, 0, tempCheck.length);
            setListStatusCheck(tempCheck);
        }
        getListRow(listDeletes.length > 0);
    }, [listDeletes.length]);

    useEffect(() => {
        let temp = new Array<boolean>(listFaculty.length);
        temp.fill(false, 0, temp.length);
        setListStatusCheck(temp);
    }, [listFaculty.length]);

    //Defind colums
    let columns: ConfigColumn[] = [
        { element: <Checkbox sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} checked={checkAll} onChange={onChangeCheckAll} />, position: Position.Left },
        { element: <span>Mã khoa</span>, position: Position.Center },
        { element: <span>Tên khoa</span>, position: Position.Left },
        { element: <span>Email</span>, position: Position.Left },
        { element: <span>Số điện thoại</span>, position: Position.Left },
        { element: <span>Tác vụ</span>, position: Position.Left },
    ];

    function openPopupAdd(open: boolean): void {
        setStatusPopup({ ...statusPopup, popupAdd: open });
    }

    function openPopupDelete(open: boolean, id?: number): void {
        if (id) setListDelete([...listDelete, id]); else setListDelete([]);
        setStatusPopup({ ...statusPopup, popupDelete: open });
    }

    function openPopupDeletes(open: boolean): void {
        setStatusPopup({ ...statusPopup, popupDeletes: open });
        if (!open) {
            setListDeletes([]);
            setListDelete([]);
            setCheckAll(false);
        }
    }

    function openPopupView(open: boolean): void {
        setStatusPopup({ ...statusPopup, popupView: open });
    }

    function deleteFaculty(list: number[]): void {
        let temp = [...listFaculty];
        temp = temp.filter((item) => !list.includes(item.id));
        setListFaculty(temp);
    }

    function addDeletes(email: string, isAdd: boolean): void {
        let temp = [...listDeletes];
        if (isAdd) {
            let item = listFaculty.find((item) => item.faculty_id === email);
            if (item) temp.push(item.id);

        } else {
            let item = listFaculty.find((item) => item.faculty_id === email);
            temp = listDeletes.filter((el) => el !== item?.id)
        }
        setListDeletes(temp);
    }

    function addFaculty(fac: FacultyType): void {
        let temp = [...listFaculty];
        temp.push(fac);
        setListFaculty(temp);
    }

    function edit(data: FacultyType): void {
        let list = { ...listFaculty }
        let temp = list.find((item) => item.id === data.id);
        temp = { ...data };
        setListFaculty(list);
    }


    function onChangeLimit(event: SelectChangeEvent<unknown>) {
        setPage({ ...page, limit: parseInt(`${event.target.value}`), current: 1 });
    }
    function onChangePage(event: React.ChangeEvent<unknown>, value: number) {
        setPage({ ...page, current: value });
    }
    function onChangeSearch(event: React.FormEvent<HTMLInputElement>): void {
        setSearch(event.currentTarget.value);
        setPage({ ...page, limit: 10, current: 1 });
    }

    return (
        <div className="account-page">
            <DeleteFaculty open={statusPopup.popupDelete} setOpen={openPopupDelete} deleteFaculty={deleteFaculty} listDelete={listDelete} />
            <DeleteFaculty open={statusPopup.popupDeletes} setOpen={openPopupDeletes} deleteFaculty={deleteFaculty} listDelete={listDeletes} />
            <AddFaculty add={addFaculty} open={statusPopup.popupAdd} setOpen={openPopupAdd} />
            <ViewFaculty edit={edit} open={statusPopup.popupView} setOpen={openPopupView} data={view} />
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
                            <IconButton
                                onClick={() => openPopupAdd(true)}
                                sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1976d2' }, }} size='small'>
                                <AddRoundedIcon />
                            </IconButton>
                        </div>
                    </div>
                    <div style={{ height: openFilter ? '4rem' : 0, marginTop: openFilter ? '0' : '1rem' }} className="table-option"  >
                        <div className="table-filter">
                            <div className="table-option--title" style={{ marginBottom: '0.7rem' }}>Lọc theo: </div>
                            <div className="table-option--filter">
                                <FormControl fullWidth sx={{ marginBottom: '1rem' }}  >
                                    <InputLabel id='province' className="title-select">Khoa</InputLabel>
                                    <Select
                                        label="district"
                                        className="select-address"
                                        defaultValue={0}
                                        sx={{ height: '2rem', width: '8rem' }}
                                    >
                                        <MenuItem value={0} >Công nghệ Thông tin</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="table-sort">
                            <div className="table-option--title" style={{ marginBottom: '0.7rem' }}>Xếp theo: </div>
                            <div className="table-option--filter">
                                <FormControl fullWidth sx={{ marginBottom: '1rem' }}  >
                                    <InputLabel id='province' className="title-select">Mục</InputLabel>
                                    <Select
                                        className="select-address"
                                        defaultValue={0}
                                        sx={{ height: '2rem', width: '8rem' }}
                                    >
                                        <MenuItem value={0} >Mã giảng viên</MenuItem>
                                        <MenuItem value={1} >Tên</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="table-option--filter">
                                <FormControl fullWidth sx={{ marginBottom: '1rem' }}  >
                                    <RadioGroup
                                        defaultValue="asc"
                                        row
                                        className='table-option--filter-group'
                                    >
                                        <FormControlLabel value="asc" control={<Radio size='small' color='success' />} label="Tăng dần" />
                                        <FormControlLabel value="dec" control={<Radio size='small' color='success' />} label="Giảm dần" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>

                    </div>
                    <div className="account-list" style={{ height: openFilter ? 'calc(100% - 6.5rem)' : 'calc(100% - 3.5rem)' }}>
                        <Table
                            configWidth={configWidth}
                            columns={columns} rows={listRow}
                            isLoad={dataFaculty.loading}
                            listDelete={listDeletes} setListDelete={addDeletes}
                            listStatusCheck={listStatusCheck} setListStatusCheck={setListStatusCheck}
                            isCheckAll={checkAll}
                            setOpenPopupDeletes={() => setStatusPopup({ ...statusPopup, popupDeletes: true })}
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