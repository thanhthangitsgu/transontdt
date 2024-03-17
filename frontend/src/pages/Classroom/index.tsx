import { Backdrop, Checkbox, CircularProgress, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Pagination, Radio, RadioGroup, Select, SelectChangeEvent, Tooltip } from '@mui/material';
import '../../styles/account.css'
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import Table from '../../components/table/Table';
import { ReactNode, useEffect, useState } from 'react';
import useGet from '../../hook/useGet';
import { ConfigColumn, StudentType, Position, ClassroomType, Page } from '../../utils/DataType';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AxiosClient from '../../api/AxiosClient';
import AddClassroom from './AddClassroom';
import ViewClassroom from './ViewClassroom';
import DeleteClassroom from './DeleteClassroom';
// import DeleteClassroom from './DeleteClassroom';
// import AddClassroom from './AddClassroom';
// import ViewClassroom from './ViewClassroom';

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

const empty: ClassroomType = {
    id: 0,
    label: '',
    capacity: 40,
    is_computer_room: 0,
    is_delete: 0,
    created_at: '',
    updated_at: ''
}


function getRow(label: string, capacity: number, is_computer_room: number, action: ReactNode): ConfigColumn[] {
    return [
        { element: label, position: Position.Center },
        { element: <span>{capacity}</span>, position: Position.Center },
        { element: <span>{`${is_computer_room}` === '1' ? 'Phòng máy' : 'Phòng học'}</span>, position: Position.Center },
        { element: action, position: Position.Center }
    ];
}

export default function Classroom() {
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [listRow, setListRow] = useState<ConfigColumn[][]>([]);
    const [statusPopup, setStatusPopup] = useState<PopupStatus>(initPopupStatus);
    const [listDeletes, setListDeletes] = useState<Array<number>>([]);
    const [listDelete, setListDelete] = useState<Array<number>>([]);
    const [listStatusCheck, setListStatusCheck] = useState<boolean[]>([]);
    const [checkAll, setCheckAll] = useState<boolean>(false);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [listClassroom, setListClassroom] = useState<ClassroomType[]>([]);
    const [view, setView] = useState<ClassroomType>(empty);
    const [search, setSearch] = useState<string>('');
    const [isComputer, setIsComputer] = useState<number>(-1);

    const [page, setPage] = useState<Page>({
        current: 1,
        total: 1,
        limit: 10
    });

    const dataClassroom = useGet(`classrooms?${search.length > 0 ? `search=${search}&` : ``}${isComputer === -1 ? `` : `is_computer_room=${isComputer}`}&page=${page.current}&size=${page.limit}`, false);
    const configWidth = [5, 25, 20, 25, 25];

    useEffect(() => {
        dataClassroom.response && setListClassroom(dataClassroom.response);
        if(dataClassroom.response)  setPage({ ...page, total: dataClassroom.total });
    }, [dataClassroom.response]);

   

    function getListRow(disable: boolean): void {
        let rows: ConfigColumn[][] = [];
        for (let room of listClassroom) {
            let action =
                <div>
                    <IconButton color="success" onClick={() => onView(room.id)}><RemoveRedEyeOutlinedIcon /></IconButton>
                    <IconButton color="error" onClick={() => openPopupDelete(true, room.id)} disabled={disable}><DeleteOutlineOutlinedIcon /></IconButton>
                </div>
            rows.push(getRow(room.label, room.capacity, room.is_computer_room, action));
        };
        setListRow(rows);
    }

    useEffect(() => {
        getListRow(false);
    }, [listClassroom]);

    function onView(id: number): void {
        setIsLoad(true);
        AxiosClient.get(`classrooms/${id}`).then((response) => {
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
            listClassroom.map((item) => temp.push(item.id));
            tempCheck.fill(true, 0, tempCheck.length);
        } else {
            tempCheck.fill(false, 0, tempCheck.length);
        };
        setListDeletes(temp);
        setListStatusCheck(tempCheck);
    };

    useEffect(() => {
        setCheckAll(!(listDeletes.length !== listClassroom.length || listDeletes.length === 0));
        if (listDeletes.length === 0) {
            setCheckAll(false);
            let tempCheck = [...listStatusCheck];
            tempCheck.fill(false, 0, tempCheck.length);
            setListStatusCheck(tempCheck);
        }
        getListRow(listDeletes.length > 0);
    }, [listDeletes.length]);

    useEffect(() => {
        let temp = new Array<boolean>(listClassroom.length);
        temp.fill(false, 0, temp.length);
        setListStatusCheck(temp);
    }, [listClassroom.length]);

    //Defind colums
    let columns: ConfigColumn[] = [
        { element: <Checkbox sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} checked={checkAll} onChange={onChangeCheckAll} />, position: Position.Left },
        { element: <span>Mã phòng</span>, position: Position.Center },
        { element: <span>Số lượng chỗ</span>, position: Position.Center },
        { element: <span>Loại phòng</span>, position: Position.Center },
        { element: <span>Tác vụ</span>, position: Position.Center },
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

    function deleteClassroom(list: number[]): void {
        let temp = [...listClassroom];
        temp = temp.filter((item) => !list.includes(item.id));
        setListClassroom(temp);
    }

    function addDeletes(email: string, isAdd: boolean): void {
        let temp = [...listDeletes];
        if (isAdd) {
            let item = listClassroom.find((item) => item.label === email);
            if (item) temp.push(item.id);

        } else {
            let item = listClassroom.find((item) => item.label === email);
            temp = listDeletes.filter((el) => el !== item?.id)
        }
        setListDeletes(temp);
    }

    function addClassroom(fac: ClassroomType): void {
        let temp = [...listClassroom];
        temp.push(fac);
        setListClassroom(temp);
    }

    function edit(data: ClassroomType): void {
        let list = [...listClassroom]
        let temp = list.findIndex((item) => item.id === data.id);
        if (temp > -1) list[temp] = data;
        setListClassroom(list);
    }

    //Handle click button filter
    const onClickButtonFillter = () => {
        setOpenFilter(!openFilter);
    }

    function onChangeType(event: SelectChangeEvent<number>): void {
        setIsComputer(parseInt(`${event.target.value}`));
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
            <AddClassroom add={addClassroom} open={statusPopup.popupAdd} setOpen={openPopupAdd} />
            <ViewClassroom edit={edit} open={statusPopup.popupView} setOpen={openPopupView} data={view} />
            <DeleteClassroom open={statusPopup.popupDelete} setOpen={openPopupDelete} deleteClassroom={deleteClassroom} listDelete={listDelete} />
            <DeleteClassroom open={statusPopup.popupDeletes} setOpen={openPopupDeletes} deleteClassroom={deleteClassroom} listDelete={listDeletes} />

            <div className="account-page__content">
                <div className="account-page-main">
                    <div className="account-page__header">
                        <div className="account-page__search-bar">
                            <button>
                                <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
                                    <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </button>
                            <input className="input" placeholder="Tìm kiếm..." type="text" value={search} onChange={onChangeSearch}/>
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
                            <IconButton
                                onClick={() => openPopupAdd(true)}
                                sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1976d2' }, }} size='small'>
                                <AddRoundedIcon />
                            </IconButton>
                        </div>
                    </div>
                    <div style={{ height: openFilter ? '4rem' : 0, marginTop: openFilter ? '0' : '1rem' }} className="table-option"  >
                        <div className="table-filter" style={{ width: '15rem' }}>
                            <div className="table-option--title" style={{ marginBottom: '0.7rem' }}>Lọc: </div>
                            <div className="table-option--filter">
                                <FormControl fullWidth sx={{ marginBottom: '1rem' }}  >
                                    <InputLabel id='province' className="title-select">Loại</InputLabel>
                                    <Select
                                        label="district"
                                        className="select-address"
                                        defaultValue={0}
                                        sx={{ height: '2rem', width: '8rem' }}
                                        value={isComputer}
                                        onChange={onChangeType}
                                    >
                                        <MenuItem value={-1} >Tất cả</MenuItem>
                                        <MenuItem value={1} >Phòng máy</MenuItem>
                                        <MenuItem value={0} >Phòng học</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className="account-list" style={{ height: openFilter ? 'calc(100% - 6.5rem)' : 'calc(100% - 3.5rem)' }}>
                        <Table
                            configWidth={configWidth}
                            columns={columns} rows={listRow}
                            isLoad={dataClassroom.loading}
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