import { Dialog, DialogContent, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { ReactNode, useEffect, useState } from "react"
import useGet from "../../hook/useGet";
import Module from "module";
import { ItemSchedule, Modules, StudentType } from "../../utils/DataType";
type props = {
    open: boolean,
    setOpen: Function,
    listSchedule: Modules[],
    listStudent: StudentType[]
}
export default function Personal({ open, setOpen, listSchedule, listStudent }: props) {
    const tableHeader = ['Trước', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Sau'];
    const lessonColumn = ['Tiết 1', 'Tiết 2', 'Tiết 3', 'Tiết 4', 'Tiết 5', ' Tiết 6', 'Tiết 7', 'Tiết 8', 'Tiết 9', ' Tiết 10'];
    const timeColumn = ['7h00', '7h50', '9h00', '9h50', '10h40', '13h00', '13h50', '15h00', '15h50', '16h40'];
    const colorItem = [
        { color: '#80d8ff', borderColor: '#0091ea' },
        { color: '#c8e6c9', borderColor: '#388e3c' },
        { color: '#ffe0b2', borderColor: '#ffa726' }
    ];

    const [idStudent, setIdStudent] = useState<string>('');

    const data = useGet(`student-subject-group/${idStudent}`, false);
    const [listItem, setListItem] = useState<ItemSchedule[]>([]);

    useEffect(() => {
        setIdStudent('');
        setListItem([]);
    }, [open])

    useEffect(() => {
        if (!data.response) return;
        let schedule: Modules[] = [];

        let dataAny: any[] = data.response;
        dataAny.map((item) => {
            let itemSchedule = listSchedule.find((el) => `${el.id}` === `${item.subject_group_id}`);
            if (itemSchedule) {
                schedule.push(itemSchedule);
                let items = listSchedule.filter((el) => el.subject_id === itemSchedule?.subject_id && el.subject_group === itemSchedule.subject_group);
                schedule.push(...items);
            }
        });

        let listItemSchedule: ItemSchedule[] = [];
        schedule.map((item) => {
            let element: ItemSchedule = {
                lecturer_id: item.lecturer_id,
                class_id: "",
                subject_id: item.subject_id,
                room_id: item.classroom_label,
                datetime: "",
                day_of_week: parseInt(`${item.day}`),
                start_lesson: parseInt(`${item.start_periods}`),
                total_lesson: parseInt(`${item.no_periods}`),
                group_id: item.group_id,
                pratice_id: item.practice_group,
                credit: 0,
                lecturer_name: `${item.lecturer_last_name} ${item.lecturer_first_name}`,
                subject_name: item.subject_name
            };

            listItemSchedule.push(element);
        });

        setListItem(listItemSchedule)
    }, [data.response, listSchedule])

    function renderItem(item: ItemSchedule): ReactNode {
        let randomColor = Math.round(Math.random() * (colorItem.length - 1));
        let style = {
            width: '14.12%',
            height: `${item.total_lesson * 9.12}%`,
            left: `${(item.day_of_week - 2) * 13.98 + 8}%`,
            top: `${(item.start_lesson - 1) * 8.98 + 10}%`,
            backgroundColor: colorItem[randomColor].color,
            borderColor: colorItem[randomColor].borderColor
        }
        return <div className="item-schedule" style={style}>
            <div className="item-schedule--title">{`${item.subject_name ? item.subject_name : ''} `}</div>
            <div className="item-schedule--detail">
                <div className="item-row">
                    <span className="font-bold">Phòng: </span> <span>{item.room_id}</span>
                </div>
                <div className="item-row">
                    <span className="font-bold">GV: </span> <span>{item.lecturer_name}</span>
                </div>
            </div>
        </div>
    }


    useEffect(() => {
        if (data.response) console.log(data.response);
    }, [data.response]);

    function onChangeStudent(event: SelectChangeEvent<string>): void {
        setIdStudent(event.target.value);
    }

    function drawEmptyTable(): ReactNode {
        return (
            <table className="table-schedule">
                <tr >
                    {tableHeader.map((item, index) => {
                        if (index === 0) return <th className=" table-header--prev" key={index}> {item} </th>
                        if (index === tableHeader.length - 1) return <th className=" table-header--next" key={index}> {item} </th>
                        return <th className="table-header--cell" key={index}> {item} </th>
                    })}
                </tr>
                {lessonColumn.map((item, indexCol) =>
                    <tr className="table-schedule--row" key={indexCol}>
                        {tableHeader.map((header, index) => {
                            if (index === 0) return <td className="table-body--lesson" style={{ borderBottomColor: indexCol === lessonColumn.length - 1 ? '#01579b' : '' }} > {item} </td>
                            if (index === tableHeader.length - 1) return <td className="table-body--time" style={{ borderBottomColor: indexCol === lessonColumn.length - 1 ? '#01579b' : '' }}> {timeColumn[indexCol]} </td>
                            return <td className="table-body--cell" style={{ borderBottomColor: indexCol === lessonColumn.length - 1 ? '#01579b' : '' }}></td>
                        })}
                    </tr>)}
            </table>
        )
    }

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth='xl'
            onClose={() => {
                setOpen(false)
            }}
        >
            <DialogContent>
                <div style={{ height: '40rem' }}>
                    <div className="dialog-account--title">Thời khóa biểu cá nhân của sinh viên </div>
                    <div className="mt-4">
                        <FormControl size="small">
                            <InputLabel id="demo-simple-select-label">Danh sách sinh viên</InputLabel>
                            <Select
                                value={listStudent.length > 0 ? idStudent : 'default'}
                                label="Danh sách sinh viên"
                                sx={{ width: '25rem' }}
                                defaultValue="default"
                                onChange={onChangeStudent}
                            >
                                <MenuItem value='default'>Chọn</MenuItem>
                                {listStudent.map((student, index) => {
                                    return <MenuItem value={student.id}>{`${student.student_id} -  ${student.last_name} ${student.first_name}`}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="table-view mt-4" style={{ height: '80%' }}>
                        <div className="schedule-header">
                            <div className="schedule-select-week">
                            </div>
                        </div>
                        {drawEmptyTable()}
                        <div className="table-content">
                            {listItem.map((item) => renderItem(item))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}