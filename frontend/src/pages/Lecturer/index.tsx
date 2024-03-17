import { Backdrop, Checkbox, CircularProgress, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Pagination, Radio, RadioGroup, Select, SelectChangeEvent, Tooltip } from '@mui/material';
import '../../styles/account.css'
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import Table from '../../components/table/Table';
import { ReactNode, useEffect, useState } from 'react';
import useGet from '../../hook/useGet';
import { ConfigColumn, FacultyType, LecturerType, Page, Position } from '../../utils/DataType';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PopupAddLecturer from './PopupAddLecture';
import PopupDeleteLecture from './PopupDeleteLecture';
import PopupViewLecturer from './PopupViewLecture';
import AxiosClient from '../../api/AxiosClient';
import ImportFile from './ImportFile';


type PopupStatus = {
    popupDelete: boolean,
    popupAdd: boolean
    popupDeletes: boolean,
    popupView: boolean,
    popupImport: boolean
}

const initPopupStatus: PopupStatus = {
    popupDelete: false,
    popupAdd: false,
    popupDeletes: false,
    popupView: false,
    popupImport: false
}

const initForm: LecturerType = {
    email: "test",
    first_name: "",
    last_name: "",
    gender: "Nam",
    address: "",
    birthday: "1900-01-01",
    faculty_id: 0,
    lecturer_id: "",
    id: '',
    phone: '',
    is_delete: 0,
    created_at: '',
    updated_at: ''
}



function getRow(id_gv: string, last_name: string, fist_name: string, email: string, faculty: string, action: ReactNode): ConfigColumn[] {
    return [
        { element: id_gv, position: Position.Left },
        { element: <span>{last_name}</span>, position: Position.Left },
        { element: <span>{fist_name}</span>, position: Position.Left },
        { element: email, position: Position.Left },
        { element: faculty, position: Position.Left },
        { element: action, position: Position.Center }
    ];
}

export default function Lecturer() {
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [listLecturer, setListLecture] = useState<LecturerType[]>([]);
    const [listRow, setListRow] = useState<ConfigColumn[][]>([]);
    const [statusPopup, setStatusPopup] = useState<PopupStatus>(initPopupStatus);
    const [listDeletes, setListDeletes] = useState<Array<string>>([]);
    const [listDelete, setListDelete] = useState<Array<string>>([]);
    const [listStatusCheck, setListStatusCheck] = useState<boolean[]>([]);
    const [checkAll, setCheckAll] = useState<boolean>(false);
    const [lecturerView, setLecturerView] = useState<LecturerType>(initForm);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [listFaculty, setListFaculty] = useState<FacultyType[]>([]);
    const [reload, setReload] = useState<number>(1);
    const [search, setSearch] = useState<string>('');

    const [page, setPage] = useState<Page>({
        current: 1,
        total: 1,
        limit: 10
    });

    const [filterFaculty, setFilterFaculty] = useState<number>(-1);

    const dataLeturers = useGet(`lecturers?${search.length > 0 ? `search=${search}&` : ``}page=${page.current}&size=${page.limit}${filterFaculty !== -1 ? `&faculty=${filterFaculty}` : ``}`, false, reload);
    const configWidth = [5, 18, 17, 10, 20, 20, 10];
    const dataFaculty = useGet('faculties', false);


    useEffect(() => {
        dataFaculty.response && setListFaculty(dataFaculty.response);
    }, [dataFaculty.response])

    function getListRow(disable: boolean): void {
        let rows: ConfigColumn[][] = [];
        for (let lecture of listLecturer) {
            let action =
                <div>
                    <IconButton color="success" onClick={() => onViewLecture(lecture.id)}><RemoveRedEyeOutlinedIcon /></IconButton>
                    <IconButton color="error" onClick={() => openPopupDelete(true, lecture.id)} disabled={disable}><DeleteOutlineOutlinedIcon /></IconButton>
                </div>
            rows.push(getRow(lecture.lecturer_id, lecture.last_name, lecture.first_name, lecture.email, getFaculty(lecture.faculty_id), action));
        };
        setListRow(rows);
    }

    function getFaculty(id: number): string {
        if (!dataFaculty.response) return 'loading...';
        let list: FacultyType[] = dataFaculty.response;
        let fac = list.find((item) => item.id === id);
        if (!fac) return 'loading...'
        return fac.name;
    }

    //View lecturer
    function onViewLecture(id: string): void {
        setIsLoad(true);
        AxiosClient.get(`lecturers/${id}`).then((response) => {
            setIsLoad(false);
            setLecturerView(response.data.data);
            setStatusPopup({ ...statusPopup, popupView: true });
        })
    }

    //Handle delete rows
    function onChangeCheckAll(event: React.ChangeEvent<HTMLInputElement>) {
        let tempCheck = [...listStatusCheck];
        let temp: string[] = [];

        if (event.target.checked) {
            listLecturer.map((item) => temp.push(item.lecturer_id));
            tempCheck.fill(true, 0, tempCheck.length);
        } else {
            tempCheck.fill(false, 0, tempCheck.length);
        };
        setListDeletes(temp);
        setListStatusCheck(tempCheck);
    };

    useEffect(() => {
        setCheckAll(!(listDeletes.length !== listLecturer.length || listDeletes.length === 0));
        if (listDeletes.length === 0) {
            setCheckAll(false);
            let tempCheck = [...listStatusCheck];
            tempCheck.fill(false, 0, tempCheck.length);
            setListStatusCheck(tempCheck);
        }
        getListRow(listDeletes.length > 0);
    }, [listDeletes.length]);

    useEffect(() => {
        let temp = new Array<boolean>(listLecturer.length);
        temp.fill(false, 0, temp.length);
        setListStatusCheck(temp);
    }, [listLecturer.length]);

    //Defind colums
    let columns: ConfigColumn[] = [
        { element: <Checkbox sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} checked={checkAll} onChange={onChangeCheckAll} />, position: Position.Left },
        { element: <span>Mã giảng viên</span>, position: Position.Left },
        { element: <span>Họ lót</span>, position: Position.Left },
        { element: <span>Tên</span>, position: Position.Left },
        { element: <span>Email</span>, position: Position.Left },
        { element: <span>Khoa</span>, position: Position.Left },
        { element: <span>Tác vụ</span>, position: Position.Center },
    ];

    useEffect(() => {
        if (!dataLeturers.response) return;
        let temp: any[] = dataLeturers.response;
        setPage({ ...page, total: dataLeturers.total });
        temp.forEach((item, index) => {
            item.faculty_id = parseInt(item.faculty_id);
        })
        setListLecture(temp);
    }, [dataLeturers.response]);

    useEffect(() => {
        getListRow(false);
    }, [listLecturer, dataFaculty.response]);

    function openPopupAdd(open: boolean): void {
        setStatusPopup({ ...statusPopup, popupAdd: open });
    }

    function openPopupDelete(open: boolean, id?: string): void {
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

    function deleteLecture(list: string[]): void {
        let temp = [...listLecturer];
        temp = temp.filter((item) => !list.includes(item.id));
        setListLecture(temp);
    }

    function addLecture(lec: LecturerType): void {
        let temp = [...listLecturer];
        temp.push(lec);
        setListLecture(temp);
    }

    function addDeletes(email: string, isAdd: boolean): void {
        let temp = [...listDeletes];
        if (isAdd) {
            let item = listLecturer.find((item) => item.lecturer_id === email);
            if (item) temp.push(item.id);

        } else {
            let item = listLecturer.find((item) => item.lecturer_id === email);
            temp = listDeletes.filter((el) => el !== item?.id)
        }
        setListDeletes(temp);
    }

    //Handle click button filter
    const onClickButtonFillter = () => {
        setOpenFilter(!openFilter);
    }

    function openImport(open: boolean) {
        setStatusPopup({ ...statusPopup, popupImport: open });
    }

    function handleImport(): void {
        setReload(Math.random());
    }

    function onChangeFaculty(event: SelectChangeEvent<number>): void {
        setFilterFaculty(parseInt(`${event.target.value}`));
        console.log(event.target.value);
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
            <Backdrop
                sx={{ color: '#fff', zIndex: 1 }}
                open={isLoad}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <ImportFile open={statusPopup.popupImport} setOpen={openImport} setList={handleImport} />
            <PopupAddLecturer isOpen={statusPopup.popupAdd} setOpen={openPopupAdd} action={addLecture} listFaculty={listFaculty} />
            <PopupDeleteLecture open={statusPopup.popupDelete} setOpen={openPopupDelete} deleteLecture={deleteLecture} listDelete={listDelete} />
            <PopupDeleteLecture open={statusPopup.popupDeletes} setOpen={openPopupDeletes} deleteLecture={deleteLecture} listDelete={listDeletes} />
            <PopupViewLecturer isOpen={statusPopup.popupView} setOpen={openPopupView} lecturer={lecturerView} listFaculty={listFaculty} />
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
                            <IconButton
                                sx={{ backgroundColor: '#2e7d32', color: 'white', '&:hover': { backgroundColor: '#2e7d32' } }} size='small'
                                onClick={() => openImport(true)}>
                                <FileUploadRoundedIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => openPopupAdd(true)}
                                sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1976d2' }, }} size='small'>
                                <AddRoundedIcon />
                            </IconButton>
                        </div>
                    </div>
                    <div style={{ height: openFilter ? '4rem' : 0, marginTop: openFilter ? '0' : '1rem' }} className="table-option"  >
                        <div className="table-filter">
                            <div className="table-option--title" style={{ marginBottom: '0.7rem' }}>Lọc: </div>
                            <div className="table-option--filter">
                                <FormControl fullWidth sx={{ marginBottom: '1rem' }}  >
                                    <InputLabel id='province' className="title-select">Khoa</InputLabel>
                                    <Select
                                        label="district"
                                        className="select-address"
                                        defaultValue={0}
                                        value={filterFaculty}
                                        sx={{ height: '2rem', width: '15rem' }}
                                        onChange={onChangeFaculty}
                                    >
                                        <MenuItem value={-1}>Tất cả</MenuItem>
                                        {listFaculty.map((item, index) => <MenuItem value={item.id} >{item.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                    </div>
                    <div className="account-list" style={{ height: openFilter ? 'calc(100% - 6.5rem)' : 'calc(100% - 3.5rem)' }}>
                        <Table
                            configWidth={configWidth}
                            columns={columns} rows={listRow}
                            isLoad={dataLeturers.loading}
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