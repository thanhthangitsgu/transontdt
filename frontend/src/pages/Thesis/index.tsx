import { FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { useEffect, useState, ReactDOM } from "react";
import ImportFile from "./ImportFile";
import { ClassroomType, LecturerType, StudentType, ThesisType } from "../../utils/DataType";
import PlaylistPlayRoundedIcon from "@mui/icons-material/PlaylistPlayRounded";
import Generation from "./Generation";
import dayjs from "dayjs";
import useGet from "../../hook/useGet";
import AxiosClient from "../../api/AxiosClient";
import UntilsFunction from "../../utils/UtilsFunction";
import ReactPDF, { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer'
import Table from "./PDF";
import ExportExcel from "./ExportExcel";
import ExportFile from "./ExportFile";
import SimCardDownloadRoundedIcon from '@mui/icons-material/SimCardDownloadRounded';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type DetailVertex = {
    index: number,
    adj: number[],
    color: number,
    name: string
}

type ThesisTime = {
    index: number,
    name: string,
    board_name: string[],
    student_name: string[],
    date: string,
    time: string,
    room: string
}

type Lecturer = {
    id: string,
    name: string
}



export default function Thesis() {
    const [openPopupImport, setPopupImport] = useState<boolean>(false);
    const [openPopupGen, setPopupGen] = useState<boolean>(false);
    const [openPopupExport, setOpenPopupExport] = useState<boolean>(false);
    const [listThesis, setList] = useState<ThesisType[]>([]);
    const [reload, setReload] = useState<number>(0);
    const [type, setType] = useState<number>(1);
    const [listView, setListView] = useState<ThesisType[]>([]);
    const dataThesis = useGet('thesis', false, reload);
    const fetchRoom = useGet('classrooms', false);
    const [listLecturer, setListLecturer] = useState<Lecturer[]>([]);
    const [dataExport, setDataExport] = useState<any[]>([]);
    let auth = useSelector<RootState, number>(state => state.auth);
    const [statusRole, setStatusRole] = useState<number[]>([0, 0, 0, 0]);
    const dataStatusRole = useGet(`get-permission?object=thesis&role=${auth}`, false);

    useEffect(() => {
        if (!dataStatusRole.response) return;
        let list: any[] = dataStatusRole.response;
        let temp = [...statusRole]
        for (let i = 0; i < 4; i++) {
            let el = list.find((item) => item === i + 1);
            if (el) temp[i] = el;
        };
        console.log(dataStatusRole.response);

        setStatusRole(temp);
    }, [dataStatusRole.response])

    useEffect(() => {
        if (!dataThesis.response) return;

        let list: any[] = dataThesis.response;
        let listThesis: ThesisType[] = [];
        list.map(async (item) => {
            let thesis: ThesisType = {
                id: item.id,
                name: item.name,
                student_id: [],
                student_name: [],
                lecturer_id: item.instructors_id,
                lecturer_name: `${item.instructors_last_name} ${item.instructors_first_name}`,
                board_id: [],
                board_name: [],
                date: item.time === 'null' ? "Chưa cập nhật" : dayjs(item.date).format('DD/MM/YYYY'),
                time: item.time === 'null' ? "Chưa cập nhật" : item.time,
                room: item.time === 'null' ? "Chưa cập nhật" : item.room,
                lecturer: item.instructors
            };

            let listStudent: any[] = item.students;
            listStudent.map((item) => {
                thesis.student_id.push(item.student_id);
                thesis.student_name.push(`${item.last_name} ${item.first_name}`);

            });

            let listLecturer: any[] = item.lecturers;
            listLecturer.map((item) => {
                thesis.board_id.push(item.lecturer_id);
                thesis.board_name.push(`${item.last_name} ${item.first_name}`);
            })

            listThesis.push(thesis);
        });
        listThesis.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
        setList(listThesis);
    }, [dataThesis.response])

    function fillColor(listThesis: ThesisType[], numberRoom: number): DetailVertex[] {
        let listVertex: DetailVertex[] = [];

        //Init list thesis
        listThesis.forEach((item, index) => {
            let vertex: DetailVertex = {
                index: parseInt(item.id),
                adj: [],
                color: -1,
                name: item.name
            }
            listVertex.push(vertex);
        });

        //Init list adj
        listVertex.forEach((item, index) => {
            listThesis.forEach((thesis, indexThesis) => {
                let el = listThesis.find((element) => item.index === parseInt(element.id));
                if (!el) return;
                if (thesis === el) return;
                if (isDuplicated(el.board_id, thesis.board_id)) item.adj.push(parseInt(thesis.id));
            });
        });

        let listPainted: DetailVertex[] = [];
        let color = -1;
        listVertex.sort((a, b) => b.adj.length - a.adj.length);
        while (!isFull(listVertex)) {
            listPainted = [];
            let current = listVertex[0];
            color++;

            listPainted.push(current);
            current.color = color;

            for (let vertex of listVertex) {
                if (vertex.color > -1) continue;
                if (listPainted.length >= numberRoom) break;

                if (!isAdj(vertex, listPainted)) {
                    vertex.color = color;
                    listPainted.push(vertex);
                }
            }
            listPainted.forEach((item) => item.adj = []);
            listVertex.sort((a, b) => b.adj.length - a.adj.length);
        }
        return listVertex;
    }

    function isAdj(vertex: DetailVertex, listVertex: DetailVertex[]): boolean {
        for (let item of listVertex) if (vertex.adj.includes(item.index)) return true;
        return false;

    }

    function isFull(listVertex: DetailVertex[]): boolean {
        for (let vertex of listVertex) if (vertex.color === -1) return false;
        return true;
    }

    function isDuplicated(listFirst: string[], listSecond: string[]): boolean {
        for (let item of listFirst) if (listSecond.includes(item)) return true;
        return false;
    }

    function convertMinutesToString(minutes: number): string {
        let hour = Math.floor(minutes / 60);
        let min = minutes % 60;

        return `${hour < 10 ? `0${hour}` : hour}g${min < 10 ? `0${min}` : min}`;
    }

    async function generate(numberRoom: number, startTime: dayjs.Dayjs, listRoom: string[],
        callBack: () => void, minutes: number, itemList: Lecturer[]): Promise<void> {
        let listVertex = fillColor(listThesis, numberRoom);
        let tempSet: Set<number> = new Set();
        listVertex.map((item) => tempSet.add(item.color));
        let numberColor = tempSet.size;
        listVertex.sort((a, b) => a.color - b.color);

        console.log(startTime.format('HH:mm'));
        let hour = parseInt(startTime.format('HH'));
        let minut = parseInt(startTime.format('mm'));

        console.log(hour, minut);

        //Create time
        let startHour: number = hour * 60 + minut;
        let time = startHour;
        let listStringTime: string[] = [];

        while (time + minutes <= 1050) {
            if (time + minutes > 690 && time < 780) time = 780;

            listStringTime.push(`${convertMinutesToString(time)} - ${convertMinutesToString(time + minutes)}`);
            time += minutes;
        }

        //Create list time
        let listTime: { date: string, time: string }[] = [];
        while (listTime.length < numberColor) {
            let date = dayjs(startTime).add(Math.floor(listTime.length / listStringTime.length), 'day').format('DD-MM-YYYY');
            let time = listStringTime[listTime.length % listStringTime.length];
            listTime.push({ date: date, time: time });
        }
        let temp = [...listThesis];
        let reFill: number[] = [];
        for (let i = 0; i < numberColor; i++) reFill.push(-1);

        //fill color
        let tempList: DetailVertex[] = [];

        listVertex.map((item, index) => {
            if (isHasLectuter(itemList[0].id, item)) {
                tempList.push(item);
                let list = listVertex.filter((vertex) => vertex.color === item.color && vertex !== item);
                tempList.push(...list);
            };
        });

        listVertex.map((item, index) => {
            let find = tempList.find((el) => el.index === item.index);
            if (!find) tempList.push(item);
        })

        let i = 0;
        let color = 0;
        while (i < tempList.length) {
            let tempColor = tempList[i].color;
            tempList[i].color = color;
            let j = i + 1;
            while (tempList[j] && tempList[j].color === tempColor) {
                tempList[j].color = color;
                j++;
                i++;
            }
            color++;
            i++;
        }

        tempList.map((item, index) => {
            let el = temp.find((element) => parseInt(element.id) === item.index);
            if (!el) return;
            el.date = listTime[item.color].date;
            el.time = listTime[item.color].time;
            el.room = listRoom[index % numberRoom];
        });

        //   setList(temp);
        let count = 0;
        temp.forEach((item, index) => {
            AxiosClient.put(`thesis/${item.id}`, {
                name: item.name,
                instructors: item.lecturer,
                room_id: getRoom(item.room),
                time: item.time,
                date: (dayjs(item.date.split('-').reverse().join('-')).format('YYYY-MM-DD')),
                semester_id: 1,
                faculty_id: 8

            }).then(() => {
                count++;
                if (count === temp.length) {
                    setPopupGen(false);
                    UntilsFunction.showToastSuccess('Tạo lịch thành công!');
                    setPopupGen(false);
                    callBack();
                    setReload(Math.random());
                }
            }).catch((e) => {
                console.log(e);
                count++;
                if (count === temp.length) {
                    setPopupGen(false);
                    UntilsFunction.showToastSuccess('Tạo lịch thành công!');
                    setPopupGen(false);
                    callBack();
                }
            })
        })
    }

    function isHasLectuter(id: string, detail: DetailVertex): boolean {
        let thesis = listThesis.find((item) => parseInt(item.id) === detail.index);
        if (!thesis) return false;
        if (thesis.board_id.includes(id)) return true;
        return false;
    }

    function onChange(event: SelectChangeEvent<number>): void {
        setType(parseInt(`${event.target.value}`));
    }

    function getRoom(label: string): number {
        if (!fetchRoom.response) return 0;
        let roomList: ClassroomType[] = fetchRoom.response;
        let room = roomList.find((item) => item.label === label);
        if (!room) return 0;
        return room.id;
    }

    useEffect(() => {
        if (listThesis.length === 0) return;
        let list: Lecturer[] = [];

        listThesis.map((thesis, index) => {
            for (let i = 0; i < thesis.board_id.length; i++) {
                let lecturer: Lecturer = { id: thesis.board_id[i], name: thesis.board_name[i] };
                let check = list.find((item) => item.id === lecturer.id);
                if (!check) list.push(lecturer);
            }
        });
        setListLecturer(list);

    }, [listThesis]);

    function handleExport(): void {

    }

    return (
        <div className="page thesis-page">
            <ExportFile handleSubmit={handleExport} open={openPopupExport} setOpen={setOpenPopupExport} data={listThesis} />
            <ImportFile open={openPopupImport} setOpen={setPopupImport} setList={setList} />
            <Generation open={openPopupGen} setOpen={setPopupGen} generate={generate} number={listThesis.length} listLecturer={listLecturer} />
            <div className="page-content">
                <div className="page-header flex">
                    <div className="flex w-2/5">
                        <FormControl fullWidth>
                            <InputLabel>Kiểu xem</InputLabel>
                            <Select
                                label='Kiểu xem'
                                value={type}
                                defaultValue={1}
                                size="small"
                                onChange={onChange}
                            >
                                <MenuItem value={0}>Xem lịch</MenuItem>
                                <MenuItem value={1}>Xem danh sách</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="flex justify-end w-3/5">
                        <div className="flex justify-end mb-2 gap-4">
                            {statusRole[1] > 0 && (
                                <IconButton
                                    sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1565c0' } }} size='small'
                                    onClick={() => setPopupGen(true)}>
                                    < PlaylistPlayRoundedIcon />
                                </IconButton>
                            )}
                            {statusRole[1] > 0 && (
                                <IconButton
                                    sx={{ backgroundColor: '#2e7d32', color: 'white', '&:hover': { backgroundColor: '#2e7d32' } }} size='small'
                                    onClick={() => setPopupImport(true)}>
                                    <FileUploadRoundedIcon />
                                </IconButton>
                            )}
                            
                        </div>
                    </div>
                </div>
                <div className="page-table mt-4">
                    {type === 1 && (
                        <div className="wrap-table w-full" >
                            <table className="tb-list-schedule tb-list-thesis">
                                <thead>
                                    <tr className="flex w-full">
                                        <th style={{ width: '5%' }}>Mã</th>
                                        <th style={{ width: '25%' }}>Tên đề tài</th>
                                        <th style={{ width: '10%' }}>Mã số SV </th>
                                        <th style={{ width: '20%' }}>Họ và tên SV </th>
                                        <th style={{ width: '10%' }}>Mã số GVHD</th>
                                        <th style={{ width: '15%' }}>Tên giảng viên</th>
                                        <th style={{ width: '15%' }}> Hội đồng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listThesis.map((item, index) =>
                                        <tr className="flex w-full">
                                            <td style={{ width: '5%', textAlign: 'center' }} className="flex items-center justify-center"><p>{item.id}</p></td>

                                            <td style={{ width: '25%' }}>
                                                <p className="thesis-name">
                                                    {item.name}
                                                </p>
                                            </td>

                                            <td style={{ width: '10%' }}>
                                                <tr style={{ width: '100%', height: '6rem', padding: '0', margin: '0' }}>
                                                    {item.student_id.map((id, index) =>
                                                        <td style={{ height: `${6 / item.student_id.length}rem`, width: '100%', borderLeft: 'none', borderRight: 'none' }}>{id}</td>)}
                                                </tr>
                                            </td>

                                            <td style={{ width: '20%' }}>
                                                <tr style={{ width: '100%', height: '6rem', padding: '0', margin: '0' }}>
                                                    {item.student_name.map((id, index) =>
                                                        <td style={{ height: `${6 / item.student_name.length}rem`, width: '100%', borderLeft: 'none', borderRight: 'none' }}>{id}</td>)}
                                                </tr>
                                            </td>

                                            <td style={{ width: '10%' }}>{item.lecturer_id}</td>
                                            <td style={{ width: '15%' }}>{item.lecturer_name}</td>

                                            <td style={{ width: '15%' }}>
                                                <tr style={{ width: '100%', height: '6rem', padding: '0', margin: '0' }}>
                                                    {item.board_name.map((id, index) =>
                                                        <td style={{ height: `${6 / item.board_name.length}rem`, width: '100%', borderLeft: 'none', borderRight: 'none' }}>{id}</td>)}
                                                </tr>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {type === 0 && (
                        <Table child={
                            <div className="wrap-table w-full">
                                <table className="tb-list-schedule tb-list-thesis">
                                    <thead>
                                        <tr className="flex" style={{ width: '100%' }}>
                                            <th style={{ width: '5%' }}>Mã</th>
                                            <th style={{ width: '25%' }}>Tên đề tài</th>
                                            <th style={{ width: '20%' }}>Sinh viên </th>
                                            <th style={{ width: '20%' }}>Hội đồng</th>
                                            <th style={{ width: '10%' }}>Ngày</th>
                                            <th style={{ width: '10%' }}>Giờ</th>
                                            <th style={{ width: '10%' }}>Phòng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listThesis.map((item, index) =>
                                            <tr className="flex w-full">
                                                <td style={{ width: '5%', textAlign: 'center' }} className="flex items-center justify-center"><p>{item.id}</p></td>

                                                <td style={{ width: '25%' }}>
                                                    <p className="thesis-name">
                                                        {item.name}
                                                    </p>
                                                </td>

                                                <td style={{ width: '20%' }}>
                                                    <tr style={{ width: '100%', height: '6rem', padding: '0', margin: '0' }}>
                                                        {item.student_name.map((id, index) =>
                                                            <td style={{ height: `${6 / item.student_name.length}rem`, width: '100%', borderLeft: 'none', borderRight: 'none' }}>{id}</td>)}
                                                    </tr>
                                                </td>
                                                <td style={{ width: '20%' }}>
                                                    <tr style={{ width: '100%', height: '6rem', padding: '0', margin: '0' }}>
                                                        {item.board_name.map((id, index) =>
                                                            <td style={{ height: `${6 / item.board_name.length}rem`, width: '100%', borderLeft: 'none', borderRight: 'none' }}>{id}</td>)}
                                                    </tr>
                                                </td>
                                                <td style={{ width: '10%' }}>{item.date}</td>
                                                <td style={{ width: '10%' }}>{item.time}</td>
                                                <td style={{ width: '10%', justifyContent: 'center' }}>{item.room}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        }></Table>

                    )}
                </div>
            </div>
        </div>
    )
}
