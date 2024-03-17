import { ReactNode, useEffect, useState } from "react";
import { scheduleData } from "../../utils/DataExample"
import { ItemClassRoom, ItemSchedule, Modules, Week } from "../../utils/DataType";
import { Button, Dialog, DialogContent, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Module from "module";

type props = {
    dataRoom: ItemClassRoom,
    open: boolean, 
    setOpen: Function
}

type TimeRoom = {
    day: number,
    start: number,
    total: number,
    note: string,
    lecturer: string

}
export default function ScheduleRoom({ dataRoom, open, setOpen }: props) {
    const tableHeader = ['Trước', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Sau'];
    const lessonColumn = ['Tiết 1', 'Tiết 2', 'Tiết 3', 'Tiết 4', 'Tiết 5', ' Tiết 6', 'Tiết 7', 'Tiết 8', 'Tiết 9', ' Tiết 10'];
    const timeColumn = ['7h00', '7h50', '9h00', '9h50', '10h40', '13h00', '13h50', '15h00', '15h50', '16h40'];
    const colorItem = [
        { color: '#80d8ff', borderColor: '#0091ea' },
        { color: '#c8e6c9', borderColor: '#388e3c' },
        { color: '#ffe0b2', borderColor: '#ffa726' }
    ];

    const [listTimeRoom, setListTimeRoom] = useState<TimeRoom[]>([]);

    function getListTimeRoom(dataRoom: ItemClassRoom): void {
        let list: TimeRoom[] = [];
        for (let i = 0; i < dataRoom.day.length; i++) {
            let j = 0;
            while (j < dataRoom.day[i].length) {
                let detail: TimeRoom = {
                    day: Math.floor(i / 2) + 1,
                    start: parseInt(`${dataRoom.day[i][j].hour}`),
                    total: 1,
                    note: dataRoom.day[i][j].note,
                    lecturer: `${dataRoom.day[i][j].lecturer_last_name} ${dataRoom.day[i][j].lecturer_first_name}`
                };

                let k = j + 1;
                while (dataRoom.day[i][k] && dataRoom.day[i][k].note === dataRoom.day[i][j].note
                    && dataRoom.day[i][k].lecturer_first_name === dataRoom.day[i][j].lecturer_first_name
                    && (parseInt(`${dataRoom.day[i][k].hour}`) - 1 === parseInt(`${dataRoom.day[i][j].hour}`))) {
                    detail.total++;
                    k++;
                    j++;
                }
                j = k;
                list.push(detail);
            }
        }
        setListTimeRoom(list);
    }

    useEffect(() => {
        getListTimeRoom(dataRoom);
    }, [dataRoom])

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

    function renderTimeRoom(item: TimeRoom): ReactNode {
        let randomColor = item.start % colorItem.length;
        let style = {
            width: '14.12%',
            height: `${item.total * 9.12}%`,
            left: `${(item.day - 1) * 13.98 + 8}%`,
            top: `${(item.start - 1) * 8.98 + 10}%`,
            backgroundColor: colorItem[randomColor].color,
            borderColor: colorItem[randomColor].borderColor
        }
        return <div className="item-schedule" style={style}>
            <div className="item-schedule--title">{`${item.note ? item.note : ''} `}</div>
            <div className="item-schedule--detail">
                <div className="item-row">
                    <span className="font-bold">Phòng: </span> <span>{dataRoom.label}</span>
                </div>
                <div className="item-row">
                    <span className="font-bold">GV: </span> <span>{item.lecturer}</span>
                </div>
            </div>
        </div>
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
                <div style={{ height: '35rem' }}>
                    <div className="dialog-account--title">Lịch sử dụng phòng <span>{`${dataRoom.label}`}</span> {`tuần ${dataRoom.week}`}</div>
                    <div className="table-view mt-4">
                        <div className="schedule-header">
                            <div className="schedule-select-week">
                            </div>
                        </div>
                        {drawEmptyTable()}
                        <div className="table-content">
                            {listTimeRoom.length > 0 && listTimeRoom.map((item, index) =>
                                renderTimeRoom(item))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}