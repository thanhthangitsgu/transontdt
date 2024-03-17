import { Button, Dialog, DialogContent, styled } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import readXlsxFile from 'read-excel-file'
import FileCopyRoundedIcon from '@mui/icons-material/FileCopyRounded';
import { CloudUploadRounded, UploadFileRounded } from "@mui/icons-material";
import { ClassroomType, LecturerType, Modules, SubjectType, TimeClassroom, TimeType } from "../../utils/DataType";
import AxiosClient from "../../api/AxiosClient";
import UntilsFunction from "../../utils/UtilsFunction";
import useGet from "../../hook/useGet";

type props = {
    open: boolean,
    setOpen: Function,
    setList: Function,
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function ImportFile({ open, setOpen, setList }: props) {
    const [fileName, setFileName] = useState<string>('');
    const [list, setListSchedule] = useState<Modules[]>([]);
    const [listRoom, setListRoom] = useState<ClassroomType[]>([]);
    const [listTime, setListTime] = useState<TimeType[]>([]);

    const dataSubject = useGet('subjects', false);
    const dataRoom = useGet('classrooms', false);
    const dataLecturer = useGet('lecturers', false);
    const dataTime = useGet('times', false);

    useEffect(() => {
        if (dataTime.response) setListTime(dataTime.response);
    }, [dataTime.response])

    function handleChangeFile(event: ChangeEvent): void {
        let temp: any = event.target;
        setFileName(`${temp.files[0].name}`)
        readXlsxFile(temp.files[0]).then((row) => {
            let listModules: Modules[] = [];
            for (let data of row) {
                let module: Modules = {
                    index: parseInt(data[0].toString()),
                    amount: parseInt(data[4].toString()),
                    group_id: `${data[7]}`,
                    lecturer_id: `${data[6]}`,
                    lecturer_name: `${data[5]}`,
                    start_lesson: `${data[10]}`,
                    total_lesson: `${data[11]}`,
                    time: [],
                    subject_id: `${data[1]}`,
                    room_id: `${data[12]}`,
                    datetime: "",
                    day_of_week: parseInt(`${data[9]}`),
                    pratice_id: `${data[8]}`,
                    credit: parseInt(`${data[3]}`),
                    subject_name: `${data[2]}`,
                    time_detail: [],
                    id: 0,
                    subject_group: `${data[7]}`,
                    practice_group: "",
                    capacity: data[4].toString(),
                    day: `${data[9]}`,
                    start_periods: `${data[10]}`,
                    no_periods: `${data[11]}`,
                    week_study: '',
                    subject_primary_id: "",
                    no_credit: `${data[3]}`,
                    lecturer_uuid: "",
                    lecturer_first_name: "",
                    lecturer_last_name: "",
                    classroom_id: "",
                    classroom_label: ""
                };

                listModules.push(module);
            };
            setListSchedule(listModules);
            console.log(listModules);
        })
    }

    function onSubmit(): void {
        console.log(list);
        //  setList(list);
        setOpen(false);
        console.log(list);
        let data: any[] = [];
        list.map((item, index) => {
            let itemData = {
                subject_group: item.group_id,
                practice_group: item.pratice_id,
                capacity: item.amount,
                day: item.day_of_week,
                start_periods: parseInt(item.start_lesson),
                no_periods: parseInt(item.total_lesson),
                week_study: '123456789012345',
                lecturer_id: getLecturer(item.lecturer_id),
                subject_id: getSubject(item.subject_id),
                classroom_id: getRoom(item.room_id),
            };
            data.push(itemData);
        });

        AxiosClient.post('subject-groups', {
            data: data,
            semester_id: 1
        }).then((data) => {
            UntilsFunction.showToastSuccess('Nhập danh sách thành công');
        }).catch((e) => {
            console.log(e);
            UntilsFunction.showToastError('Lỗi: ' + e.message);
        });

        let datatemp: any[] = [];
        listRoom.filter((item) => `${item.is_computer_room}` === '1').map((room) => {
            console.log(room);

            let listTemp = list.filter((item) => item.room_id === room.label);
            listTemp.map((item) => {
                let day = parseInt(item.day);
                let start = parseInt(item.start_periods);
                let lession = parseInt(item.no_periods);

                let newTime: TimeClassroom[] = [];
                for (let j = start; j < start + lession; j++) {
                    let time: TimeClassroom = {
                        classroom: room.label,
                        week: 1,
                        day: day - 1,
                        time: j
                    };
                    newTime.push(time);
                }

                item.time = newTime;

                let el: any = {
                    classroom_id: room.id,
                    list_id_time: [],
                    note: item.subject_name,
                    lecturer_id: item.lecturer_id,
                    status: 1
                };
                el.classroom_id = room.id;
                let id_time: number[] = [];
                newTime.map((time) => {
                    let temp = listTime.filter((item) => `${item.day}` === `${time.day}` && `${item.hour}` === `${time.time}`);
                    let temp2: number[] = [];
                    temp.map((item) => temp2.push(item.id))
                    if (temp) id_time.push(...temp2);
                });

                el.list_id_time.push(...id_time);
                datatemp.push(el);
            });
        });

        for (let el of datatemp) {
            AxiosClient.post('classroom-time', el);
        }
    }

    function getRoom(label: string): number {
        if (!dataRoom.response) return 1;
        let list: ClassroomType[] = dataRoom.response;
        let item = list.find((item) => item.label === label);
        if (!item) return 1;
        return item.id;
    }

    function getSubject(subject_id: string) {
        if (!dataSubject.response) return 1;
        let list: SubjectType[] = dataSubject.response;
        let item = list.find((item) => item.subject_id === subject_id);
        if (!item) return 1;
        return item.id;
    }

    function getLecturer(lecturer_id: string) {
        if (!dataLecturer.response) return 1;
        let list: LecturerType[] = dataLecturer.response;
        let item = list.find((item) => item.lecturer_id === lecturer_id);
        if (!item) return 1;
        return item.id;
    }

    useEffect(() => {
        if (dataRoom.response) setListRoom(dataRoom.response);
    }, [dataRoom.response])

    useEffect(() => {
        console.log(listTime);

    }, [listTime])
    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth='sm'
            onClose={() => setOpen(false)}
        >
            <DialogContent>
                <div className="dialog-account--title">Import danh sách nhóm môn học</div>
                <div className="mt-4 mb-4">Lưu ý: File tải lên dựa trên <a href='/excel/schedule.xlsx'><span className="text-[#1565c0] font-semibold">danh sách mẫu</span></a></div>
                <div className="w-full flex items-center justify-center flex-col">
                    <div className="mb-2 italic">{fileName}</div>
                    <Button component="label" variant="contained" startIcon={< FileCopyRoundedIcon />} color="success">
                        Chọn File
                        <VisuallyHiddenInput type="file" onChange={handleChangeFile} />
                    </Button>
                </div>
                <div className="flex w-full justify-end mt-4 gap-4">
                    <Button color="error">Hủy</Button>
                    <Button variant="contained" startIcon={<CloudUploadRounded />} onClick={onSubmit}>Tải lên</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}