import '../../styles/schedule.css'
import { Modules, StudentType, TimeClassroom } from "../../utils/DataType";
import { useEffect, useState } from "react";
import { Backdrop, CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import ImportFile from "./ImportFile";
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import PlaylistPlayRoundedIcon from '@mui/icons-material/PlaylistPlayRounded';
import useGet from "../../hook/useGet";
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import Personal from "./Personal";
import AxiosClient from "../../api/AxiosClient";
import UntilsFunction from "../../utils/UtilsFunction";

export default function Schedule() {
    const [list, setList] = useState<Modules[][]>([]);
    let listSchedule: Modules[][] = [];
    const [type, setType] = useState<number>(0);
    const [listScheduleGet, setListSchedule] = useState<Modules[]>([]);
    const [openPopupLoad, setOpenLoad] = useState<boolean>(false);
    const dataSchedule = useGet('subject-groups', false);
    const [openPopupView, setOpenPopupView] = useState<boolean>(false);
    const dataStudent = useGet('students', false);
    const [listStudent, setListStudent] = useState<StudentType[]>([]);
    const [openBackdrop, setBackdrop] = useState<boolean>(false);

    useEffect(() => {
        if (dataStudent.response) {
            let temp: StudentType[] = dataStudent.response;
            temp = temp.filter((item) => item.student_id.slice(0, 4) === '3123');
            setListStudent(temp);
            console.log(temp);
        }
    }, [dataStudent.response])

    function handleGen(): void {
        //Create list
        let list = createListSchedule();

        //Spread list
        let tempList: Modules[] = [];
        list.map((item) => {
            for (let i = 0; i < item.amount; i++) {
                item.index = tempList.length;
                tempList.push({ ...item });
            }
        });

        //Gen list schedule
        list = [...tempList];
        if (list.length > 3000) for (let i = 0; i < 300; i++) {
            let temp: Modules[] = [];
            genSchedule(list, temp, i + 1);
        };
        setList(listSchedule);
        console.log(listSchedule);

        for (let i = 0; i < listStudent.length; i++) {
            let random = Math.floor(Math.random() * 300);
            let temp: number[] = [];
            listSchedule[i].map((item) => temp.push(item.id));
            AxiosClient.post('student-subject-group', {
                subject_group_id: temp,
                student_id: listStudent[i].id
            })

            // listSchedule[i].map((item) => {
            //     AxiosClient.post('student-subject-group', {
            //         subject_group_id: item.id,
            //         student_id: listStudent[i].id
            //     })
            // })
        };

        setBackdrop(true);
        setTimeout(() => {
            UntilsFunction.showToastSuccess('Đã thêm thời khóa biểu cho sinh viên!')
            setBackdrop(false);
        }, 5000);
    }

    function createListSchedule(): Modules[] {
        let list: Modules[] = [];

        //Init list module
        for (let i = 0; i < listScheduleGet.length; i++) {
            let module: Modules = {
                index: i,
                amount: parseInt(listScheduleGet[i].capacity),
                group_id: listScheduleGet[i].subject_group,
                lecturer_id: listScheduleGet[i].lecturer_id,
                lecturer_name: listScheduleGet[i].lecturer_first_name,
                start_lesson: listScheduleGet[i].start_periods,
                total_lesson: listScheduleGet[i].no_periods,
                time: [],
                subject_id: listScheduleGet[i].subject_id,
                room_id: listScheduleGet[i].classroom_label,
                datetime: "",
                day_of_week: parseInt(listScheduleGet[i].day),
                pratice_id: listScheduleGet[i].practice_group,
                credit: parseInt(listScheduleGet[i].no_credit),
                subject_name: listScheduleGet[i].subject_name,
                time_detail: [
                    {
                        classroom: listScheduleGet[i].classroom_label,
                        start_time: parseInt(listScheduleGet[i].no_periods),
                        total_lesson: parseInt(listScheduleGet[i].no_periods),
                        day: parseInt(listScheduleGet[i].day)
                    }
                ],
                id: listScheduleGet[i].id,
                subject_group: "",
                practice_group: "",
                capacity: "",
                day: "",
                start_periods: "",
                no_periods: "",
                week_study: "",
                subject_primary_id: "",
                no_credit: "",
                lecturer_uuid: "",
                lecturer_first_name: "",
                lecturer_last_name: "",
                classroom_id: "",
                classroom_label: ""
            }


            let day = parseInt(listScheduleGet[i].day);
            let start = parseInt(listScheduleGet[i].start_periods);
            let lession = parseInt(listScheduleGet[i].no_periods);

            let newTime: TimeClassroom[] = [];
            for (let j = start; j < start + lession; j++) {
                let time: TimeClassroom = {
                    classroom: listScheduleGet[i].classroom_label,
                    week: 1,
                    day: day - 2,
                    time: j
                };
                newTime.push(time);
            }

            module.time = newTime;
            list.push(module);
        };

        //Merge practice
        list.forEach((item, index) => {
            if (item.pratice_id !== 'null') {
                let group_id = list.find((module) => module.group_id === item.group_id && module.pratice_id === "null" && module.subject_id === item.subject_id);
                if (!group_id) return;
                item.time_detail.push(...group_id.time_detail);
                item.time.push(...group_id.time);
            }
        });

        //Clear list
        list.forEach((item, index) => {
            if (item.pratice_id === "null") {
                let group_id = list.find((module) => module.group_id === item.group_id && module.pratice_id !== "null" && module.subject_id === item.subject_id);
                if (group_id) list.splice(index, 1);
            }
        });

        //Rename group_id
        list.forEach((item) => {
            if (item.pratice_id !== 'null') item.group_id = `${item.group_id} - 0${item.pratice_id}`

        });

        //Create detail time
        list.forEach((item, index) => {
            let group_id = list.filter((module) => module.group_id === item.group_id && module.subject_id === item.subject_id && module !== item);
            group_id.map((el, index) => {
                item.time_detail.push(...el.time_detail);
                item.time.push(...el.time);
                let indexEl = list.findIndex((module) => module === el);
                if (indexEl > -1) list.splice(indexEl, 1);
            });
        });

        return list;
    }

    function isIdentical(time_1: TimeClassroom[], time_2: TimeClassroom[]): boolean {
        for (let time of time_1) {
            let item = time_2.find((item) => {
                return item.day === time.day && time.time === item.time && item.week === time.week;
            });
            if (item) return true;
        };
        return false;
    }

    function isIdenticalList(time_1: TimeClassroom[], module: Modules[]): boolean {
        for (let current of module) if (isIdentical(current.time, time_1)) return true;
        return false;
    }

    function isSubjectExist(subject: string, module: Modules[]): boolean {
        for (let current of module) if (current.subject_id === subject) return true;
        return false;
    }

    function modulePicked(index: number, list: Modules[][]): boolean {
        for (let item of list) {
            let indexItem = item.findIndex((item) => item.index === index);
            if (indexItem > -1) return true;
        }
        return false;
    }

    function genSchedule(list: Modules[], current: Modules[], number: number): void {
        for (let i = 0; i < list.length; i++)
            if (!isSubjectExist(list[i].subject_id, current) &&
                !isIdenticalList(list[i].time, current) && listSchedule.length < number
                && !modulePicked(list[i].index, listSchedule)) {
                current.push(list[i]);
                if (current.length === 5) {
                    listSchedule.push(JSON.parse(JSON.stringify(current)));
                    return;
                } else genSchedule(list, [...current], number)
                current.pop();
            }
    }

    useEffect(() => {
        if (!dataSchedule.response) return;
        setListSchedule(dataSchedule.response);

    }, [dataSchedule.response])

    return (
        <div className="page schedule-page">
            <div className="page-content flex">
                <>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={openBackdrop}
                        onClick={() => setBackdrop(false)}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <ImportFile open={openPopupLoad} setOpen={setOpenLoad} setList={setListSchedule} />
                    <Personal open={openPopupView} setOpen={setOpenPopupView} listSchedule={listScheduleGet} listStudent={listStudent} />
                    <div className="grid grid-cols-2">
                        <div className="account-page__search-bar" style={{ width: '100%', height: '2.5rem' }} >
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
                        <div className="w-full flex justify-end mb-4 gap-4">
                            <IconButton
                                sx={{ backgroundColor: '#ad1457', color: 'white', '&:hover': { backgroundColor: '#ad1457' } }} size='small'
                                onClick={() => setOpenPopupView(true)}>
                                <VisibilityRoundedIcon />
                            </IconButton>
                            <IconButton
                                sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1565c0' } }} size='small'
                                onClick={() => handleGen()}>
                                < PlaylistPlayRoundedIcon />
                            </IconButton>
                            <IconButton
                                sx={{ backgroundColor: '#2e7d32', color: 'white', '&:hover': { backgroundColor: '#2e7d32' } }} size='small'
                                onClick={() => setOpenLoad(true)}>
                                <FileUploadRoundedIcon />
                            </IconButton>
                        </div>
                    </div>
                    <div className="page-table">
                        <div className="wrap-table">
                            <table className="tb-list-schedule tb-list-thesis">
                                <thead>
                                    <tr className="flex w-full">
                                        <th style={{ width: '4%' }}>#</th>
                                        <th style={{ width: '8%' }}>Mã MH</th>
                                        <th style={{ width: '20%' }}>Tên môn</th>
                                        <th style={{ width: '7%' }}>STC</th>
                                        <th style={{ width: '7%' }}>SL</th>
                                        <th style={{ width: '20%' }}>Tên giảng viên</th>
                                        <th style={{ width: '14%' }}>Mã giảng viên</th>
                                        <th style={{ width: '5%' }}>NMH</th>
                                        <th style={{ width: '5%' }}>TH</th>
                                        <th style={{ width: '5%' }}>Thứ</th>
                                        <th style={{ width: '5%' }}>TBD</th>
                                        <th style={{ width: '10%' }}>Số tiết</th>
                                        <th style={{ width: '10%' }}>Phòng</th>
                                    </tr>
                                </thead>
                                <tbody className="w-full">
                                    {listScheduleGet.map((item, index) =>
                                        <tr className="flex w-full">
                                            <td style={{ width: '4%', height: '2rem', justifyContent: 'center' }}>{item.id}</td>
                                            <td style={{ width: '8%', height: '2rem', justifyContent: 'center' }}>{item.subject_id}</td>
                                            <td style={{ width: '20%', height: '2rem' }}>{item.subject_name}</td>
                                            <td style={{ width: '7%', height: '2rem', justifyContent: 'center' }}>{item.no_credit}</td>
                                            <td style={{ width: '7%', height: '2rem', justifyContent: 'center' }}>{item.capacity}</td>
                                            <td style={{ width: '20%', height: '2rem' }}>{`${item.lecturer_last_name} ${item.lecturer_first_name}`}</td>
                                            <td style={{ width: '14%', height: '2rem', justifyContent: 'center' }}>{item.lecturer_id}</td>
                                            <td style={{ width: '5%', height: '2rem', justifyContent: 'center' }}>{item.subject_group}</td>
                                            <td style={{ width: '5%', height: '2rem', justifyContent: 'center' }}>{item.practice_group}</td>
                                            <td style={{ width: '5%', height: '2rem', justifyContent: 'center' }}>{item.day}</td>
                                            <td style={{ width: '5%', height: '2rem', justifyContent: 'center' }}>{item.start_periods}</td>
                                            <td style={{ width: '10%', height: '2rem', justifyContent: 'center' }}>{item.no_periods}</td>
                                            <td style={{ width: '10%', height: '2rem', justifyContent: 'center' }}>{item.classroom_label}</td>
                                        </tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div></>
            </div>
        </div>
    )
}

