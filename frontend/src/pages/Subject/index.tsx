import { Backdrop, Checkbox, CircularProgress, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Pagination, Radio, RadioGroup, Select, Tooltip } from '@mui/material';
import '../../styles/account.css'
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import Table from '../../components/table/Table';
import { ReactNode, useEffect, useState } from 'react';
import useGet from '../../hook/useGet';
import { ConfigColumn, StudentType, Position, SubjectType, MajorType } from '../../utils/DataType';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AxiosClient from '../../api/AxiosClient';
import dayjs from 'dayjs';
import AddSubject from './AddSubject';
// import AddSubject from './AddSubject';
// import ViewSubject from './ViewSubject';
// import DeleteSubject from './DeleteSubject';

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

const empty: SubjectType = {
    id: 0,
    subject_id: '',
    name: '',
    no_credit: '',
    major_id: '',
    is_delete: 0,
    create_at: '',
    update_at: ''
}




export default function Subject() {
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [listRow, setListRow] = useState<ConfigColumn[][]>([]);
    const [statusPopup, setStatusPopup] = useState<PopupStatus>(initPopupStatus);
    const [listDeletes, setListDeletes] = useState<Array<number>>([]);
    const [listDelete, setListDelete] = useState<Array<number>>([]);
    const [listStatusCheck, setListStatusCheck] = useState<boolean[]>([]);
    const [checkAll, setCheckAll] = useState<boolean>(false);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [listSubject, setListSubject] = useState<SubjectType[]>([]);
    const [view, setView] = useState<SubjectType>(empty);

    const dataSubject = useGet('subjects', false);
    const dataMajor = useGet('majors', false);

    const configWidth = [5, 15, 25, 20, 20, 15];

    useEffect(() => {
        dataSubject.response && setListSubject(dataSubject.response)
    }, [dataSubject.loading]);

    function getRow(id: string, name: string, credit: string, major: string, action: ReactNode): ConfigColumn[] {
        return [
            { element: id, position: Position.Center },
            { element: <span>{name}</span>, position: Position.Center },
            { element: <span>{credit}</span>, position: Position.Center },
            { element: <span>{getMajor(major)}</span>, position: Position.Center },
            { element: action, position: Position.Center }
        ];
    }

    function getListRow(disable: boolean): void {
        let rows: ConfigColumn[][] = [];
        for (let subject of listSubject) {
            let action =
                <div>
                    <IconButton color="success" onClick={() => onView(subject.id)}><RemoveRedEyeOutlinedIcon /></IconButton>
                    <IconButton color="error" onClick={() => openPopupDelete(true, subject.id)} disabled={disable}><DeleteOutlineOutlinedIcon /></IconButton>
                </div>
            rows.push(getRow(subject.subject_id, subject.name, subject.no_credit, subject.major_id, action));
        };
        setListRow(rows);
    }

    function getMajor(id: string): string {
        if (!dataMajor.response) return 'Chưa cập nhật';
        let temp: MajorType[] = dataMajor.response;
        let item = temp.find((major) => `${major.id}` === `${id}`);
        if (!item) return 'Chưa cập nhật';
        return item.name
    }

    useEffect(() => {
        getListRow(false);
    }, [listSubject]);

    function onView(id: number): void {
        setIsLoad(true);
        AxiosClient.get(`semesters/${id}`).then((response) => {
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
            listSubject.map((item) => temp.push(item.id));
            tempCheck.fill(true, 0, tempCheck.length);
        } else {
            tempCheck.fill(false, 0, tempCheck.length);
        };
        setListDeletes(temp);
        setListStatusCheck(tempCheck);
    };

    useEffect(() => {
        setCheckAll(!(listDeletes.length !== listSubject.length || listDeletes.length === 0));
        if (listDeletes.length === 0) {
            setCheckAll(false);
            let tempCheck = [...listStatusCheck];
            tempCheck.fill(false, 0, tempCheck.length);
            setListStatusCheck(tempCheck);
        }
        getListRow(listDeletes.length > 0);
    }, [listDeletes.length]);

    useEffect(() => {
        let temp = new Array<boolean>(listSubject.length);
        temp.fill(false, 0, temp.length);
        setListStatusCheck(temp);
    }, [listSubject.length]);

    //Defind colums
    let columns: ConfigColumn[] = [
        { element: <Checkbox sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} checked={checkAll} onChange={onChangeCheckAll} />, position: Position.Left },
        { element: <span>Mã môn học</span>, position: Position.Center },
        { element: <span>Tên môn học</span>, position: Position.Center },
        { element: <span>Số tín chỉ</span>, position: Position.Center },
        { element: <span>Ngành</span>, position: Position.Center },
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

    function deleteSubject(list: number[]): void {
        let temp = [...listSubject];
        temp = temp.filter((item) => !list.includes(item.id));
        setListSubject(temp);
    }

    function addDeletes(email: number, isAdd: boolean): void {
        let temp = [...listDeletes];
        if (isAdd) {
            let item = listSubject.find((item) => item.id === email);
            if (item) temp.push(item.id);

        } else {
            let item = listSubject.find((item) => item.id === email);
            temp = listDeletes.filter((el) => el !== item?.id)
        }
        console.log(email);

        setListDeletes(temp);
    }

    function addSubject(fac: SubjectType): void {
        let temp = [...listSubject];
        temp.push(fac);
        setListSubject(temp);
    }

    function edit(data: SubjectType): void {
        let list = [...listSubject]
        let temp = list.findIndex((item) => item.id === data.id);
        if (temp > -1) list[temp] = data;
        setListSubject(list);
    }

    //Handle click button filter
    const onClickButtonFillter = () => {
        setOpenFilter(!openFilter);
    }
    return (
        <div className="account-page">
            {/* <AddSubject add={addSubject} open={statusPopup.popupAdd} setOpen={openPopupAdd} />
            <ViewSubject edit={edit} open={statusPopup.popupView} setOpen={openPopupView} data={view} />
            <DeleteSubject open={statusPopup.popupDelete} setOpen={openPopupDelete} deleteSubject={deleteSubject} listDelete={listDelete} />
            <DeleteSubject open={statusPopup.popupDeletes} setOpen={openPopupDeletes} deleteSubject={deleteSubject} listDelete={listDeletes} /> */}
            <AddSubject add={addSubject} open={statusPopup.popupAdd} setOpen={openPopupAdd}/>
            <div className="account-page__content">
                <div className="account-page-main">
                    <div className="account-page__header">
                        <div className="account-page__search-bar">
                            <button>
                                <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
                                    <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </button>
                            <input className="input" placeholder="Tìm kiếm..." type="text" />
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
                            <IconButton sx={{ backgroundColor: '#2e7d32', color: 'white', '&:hover': { backgroundColor: '#2e7d32' } }} size='small' >
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
                            isLoad={dataSubject.loading}
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
                            defaultValue={0}
                            sx={{ height: '2rem' }}
                            className='pagination-row--select'
                        >
                            <MenuItem value={0} >5</MenuItem>
                            <MenuItem value={1} >10</MenuItem>
                            <MenuItem value={2} >15</MenuItem>
                        </Select>
                        <span>hàng</span>
                    </div>
                    <div className="pagination-list">
                        {/* {isAddDelete && (<Pagination count={10} defaultPage={6} siblingCount={0} boundaryCount={1} />)} */}
                    </div>
                </div>
            </div>
        </div>
    )
}