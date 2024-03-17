import { Backdrop, Checkbox, CircularProgress, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Pagination, Radio, RadioGroup, Select, SelectChangeEvent, Tooltip } from '@mui/material';
import '../../styles/account.css'
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import Table from '../../components/table/Table';
import { ReactNode, useEffect, useState } from 'react';
import useGet from '../../hook/useGet';
import { ConfigColumn, StudentType, Position, FacultyType, MajorType, Page } from '../../utils/DataType';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PopupAddStudent from './PopupAddStudent'

import PopupViewStudent from './PopupViewStudent';
import AxiosClient from '../../api/AxiosClient';
import PopupDeleteStudent from './PopupDeleteStudent';
import PopupDeleteLecture from '../Lecturer/PopupDeleteLecture';
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

const initForm: StudentType = {
    email: "test",
    first_name: "",
    last_name: "",
    gender: "Nam",
    address: "",
    birthday: "1900-01-01",
    faculty_id: -1,
    student_id: "",
    id: '',
    phone: '',
    major_id: -1,
    created_at: '',
    updated_at: '',
    is_deleted: 0
}


function getRow(id_student: string, last_name: string, fist_name: string, birthday: string, email: string, faculty: string, action: ReactNode): ConfigColumn[] {
    return [
        { element: id_student, position: Position.Left },
        { element: <span>{last_name}</span>, position: Position.Left },
        { element: <span>{fist_name}</span>, position: Position.Left },
        { element: <span>{birthday}</span>, position: Position.Center },
        { element: email, position: Position.Left },
        { element: faculty, position: Position.Left },
        { element: action, position: Position.Center }
    ];
}

export default function Student() {
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [listStudent, setListStudent] = useState<StudentType[]>([]);
    const [listRow, setListRow] = useState<ConfigColumn[][]>([]);
    const [statusPopup, setStatusPopup] = useState<PopupStatus>(initPopupStatus);
    const [listDeletes, setListDeletes] = useState<Array<string>>([]);
    const [listDelete, setListDelete] = useState<Array<string>>([]);
    const [listStatusCheck, setListStatusCheck] = useState<boolean[]>([]);
    const [checkAll, setCheckAll] = useState<boolean>(false);
    const [studentView, setStudentView] = useState<StudentType>(initForm);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [listFaculty, setListFaculty] = useState<FacultyType[]>([]);
    const [listMajor, setListMajor] = useState<MajorType[]>([]);
    const [isReload, setIsReload] = useState<number>(0);
    const [search, setSearch] = useState<string>('');

    const [page, setPage] = useState<Page>({
        current: 1,
        total: 1,
        limit: 10
    });

    const [filterFaculty, setFilterFaculty] = useState<number>(-1);

    const dataStudents = useGet(`students?search=${search}&page=${page.current}&size=${page.limit}${filterFaculty !== -1 ? `faculty=${filterFaculty}` : ``}`, false, isReload);
    const configWidth = [5, 15, 15, 10, 10, 20, 20, 10];
    const dataFaculty = useGet('faculties', false);
    const dataMajor = useGet('majors', false);

    function getListRow(disable: boolean): void {
        let rows: ConfigColumn[][] = [];
        for (let student of listStudent) {
            let action =
                <div>
                    <IconButton color="success" onClick={() => onViewLecture(student.id)}><RemoveRedEyeOutlinedIcon /></IconButton>
                    <IconButton color="error" onClick={() => openPopupDelete(true, student.id)} disabled={disable}><DeleteOutlineOutlinedIcon /></IconButton>
                </div>
            rows.push(getRow(student.student_id, student.last_name, student.first_name, student.birthday, student.email, getFaculty(student.faculty_id), action));
        };
        setListRow(rows);
    }

    function getFaculty(id: number): string {
        let item = listFaculty.find((fac) => fac.id === id);
        if (!item) return 'loading...';
        return item.name;
    }

    //Get data
    useEffect(() => {
        if (!dataStudents.response) return;
        let temp: any[] = dataStudents.response;
        setPage({ ...page, total: dataStudents.total });
        temp.forEach((item, index) => {
            item.faculty_id = parseInt(item.faculty_id);
            item.major_id = parseInt(item.major_id);
        })
        setListStudent(temp);
    }, [dataStudents.response]);

    useEffect(() => {
        dataFaculty.response && setListFaculty(dataFaculty.response);
    }, [dataFaculty.response]);

    useEffect(() => {
        if (!dataMajor.response) return;
        for (let el of dataMajor.response) el.faculty_id = parseInt(el.faculty_id);
        setListMajor(dataMajor.response);
    }, [dataMajor.response])

    useEffect(() => {

        getListRow(false);
    }, [listStudent, listFaculty]);

    //View student
    function onViewLecture(id: string): void {
        setIsLoad(true);
        AxiosClient.get(`students/${id}`).then((response) => {
            setIsLoad(false);
            setStudentView(response.data.data);
            setStatusPopup({ ...statusPopup, popupView: true });
        })
    }

    //Handle delete rows
    function onChangeCheckAll(event: React.ChangeEvent<HTMLInputElement>) {
        let tempCheck = [...listStatusCheck];
        let temp: string[] = [];

        if (event.target.checked) {
            listStudent.map((item) => temp.push(item.student_id));
            tempCheck.fill(true, 0, tempCheck.length);
        } else {
            tempCheck.fill(false, 0, tempCheck.length);
        };
        setListDeletes(temp);
        setListStatusCheck(tempCheck);
    };

    useEffect(() => {
        setCheckAll(!(listDeletes.length !== listStudent.length || listDeletes.length === 0));
        if (listDeletes.length === 0) {
            setCheckAll(false);
            let tempCheck = [...listStatusCheck];
            tempCheck.fill(false, 0, tempCheck.length);
            setListStatusCheck(tempCheck);
        }
        getListRow(listDeletes.length > 0);
    }, [listDeletes.length]);

    useEffect(() => {
        let temp = new Array<boolean>(listStudent.length);
        temp.fill(false, 0, temp.length);
        setListStatusCheck(temp);
    }, [listStudent.length]);

    //Defind colums
    let columns: ConfigColumn[] = [
        { element: <Checkbox sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} checked={checkAll} onChange={onChangeCheckAll} />, position: Position.Left },
        { element: <span>Mã sinh viên</span>, position: Position.Left },
        { element: <span>Họ lót</span>, position: Position.Left },
        { element: <span>Tên</span>, position: Position.Left },
        { element: <span>Ngày sinh</span>, position: Position.Center },
        { element: <span>Email</span>, position: Position.Left },
        { element: <span>Khoa</span>, position: Position.Left },
        { element: <span>Tác vụ</span>, position: Position.Center },
    ];

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

    function deleteStudent(list: string[]): void {
        let temp = [...listStudent];
        temp = temp.filter((item) => !list.includes(item.id));
        setListStudent(temp);
    }

    function addDeletes(email: string, isAdd: boolean): void {
        let temp = [...listDeletes];
        if (isAdd) {
            let item = listStudent.find((item) => item.student_id === email);
            if (item) temp.push(item.id);

        } else {
            let item = listStudent.find((item) => item.student_id === email);
            temp = listDeletes.filter((el) => el !== item?.id)
        }
        setListDeletes(temp);
    }

    function addStudent(lec: StudentType): void {
        let temp = [...listStudent];
        temp.push(lec);
        setListStudent(temp);
    }

    //Handle click button filter
    const onClickButtonFillter = () => {
        setOpenFilter(!openFilter);
    }

    function openPopupImport(open: boolean) {
        setStatusPopup({ ...statusPopup, popupImport: open })
    }

    function handleImport(): void {
        setIsReload(Math.random());
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
            <ImportFile open={statusPopup.popupImport} setOpen={openPopupImport} setList={handleImport} />
            <PopupAddStudent isOpen={statusPopup.popupAdd} setOpen={openPopupAdd} action={addStudent} listFaculty={listFaculty} listMajor={listMajor} />
            <PopupViewStudent isOpen={statusPopup.popupView} setOpen={openPopupView} student={studentView} listFaculty={listFaculty} listMajor={listMajor} />
            <PopupDeleteStudent open={statusPopup.popupDelete} setOpen={openPopupDelete} deleteStudent={deleteStudent} listDelete={listDelete} />
            <PopupDeleteLecture open={statusPopup.popupDeletes} setOpen={openPopupDeletes} deleteLecture={deleteStudent} listDelete={listDeletes} />
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
                                onClick={() => openPopupImport(true)}>
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
                            isLoad={dataStudents.loading}
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