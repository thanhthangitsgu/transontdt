import { ReactNode, useEffect, useState } from "react";
import { scheduleData } from "../../utils/DataExample"
import { ItemSchedule, Modules, Week } from "../../utils/DataType";
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Module from "module";

type props = {
    listSchedule: Modules[][]
}
export default function TableView({ listSchedule }: props) {
    let data = scheduleData;
    const [listWeek, setListWeek] = useState<Week[]>([]);
    const tableHeader = ['Trước', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Sau'];
    const lessonColumn = ['Tiết 1', 'Tiết 2', 'Tiết 3', 'Tiết 4', 'Tiết 5', ' Tiết 6', 'Tiết 7', 'Tiết 8', 'Tiết 9', ' Tiết 10'];
    const timeColumn = ['7h00', '7h50', '9h00', '9h50', '10h40', '13h00', '13h50', '15h00', '15h50', '16h40'];
    const colorItem = [
        { color: '#80d8ff', borderColor: '#0091ea' },
        { color: '#c8e6c9', borderColor: '#388e3c' },
        { color: '#ffe0b2', borderColor: '#ffa726' }
    ]

    function getListSchedule(): Week[] {
        let listWeek: Week[] = [];

        data.data.ds_tuan_tkb.map((item, index) => {
            let week: Week = {
                start_time: item.ngay_bat_dau,
                end_time: item.ngay_ket_thuc,
                sequence: item.tuan_hoc_ky,
                list_item: []
            };
            // item.ds_thoi_khoa_bieu.map((item, index) => {
            //     let schedule: ItemSchedule = {
            //         lecturer_id: item.ma_giang_vien,
            //         class_id: item.ma_lop ? item.ma_lop : '',
            //         subject_id: item.ma_mon,
            //         room_id: item.ma_phong,
            //         datetime: item.ngay_hoc,
            //         day_of_week: item.thu_kieu_so,
            //         start_lesson: item.tiet_bat_dau,
            //         total_lesson: item.so_tiet,
            //         group_id: item.ma_nhom,
            //         pratice_id: item.ma_to_th,
            //         credit: parseInt(item.so_tin_chi),
            //         lecturer_name: item.ten_giang_vien,
            //         subject_name: item.ten_mon
            //     }

            //     week.list_item.push(schedule);
            // });
            listSchedule[400].map((item) => {
                item.time_detail.map((detail) => {
                    let schedule: ItemSchedule = {
                        lecturer_id: item.lecturer_id,
                        class_id: '',
                        subject_id: item.subject_id,
                        room_id: item.room_id,
                        datetime: '',
                        day_of_week: detail.day,
                        start_lesson: detail.start_time,
                        total_lesson: detail.total_lesson,
                        group_id: item.group_id,
                        pratice_id: item.pratice_id,
                        credit: item.credit,
                        lecturer_name: item.lecturer_name,
                        subject_name: item.subject_name
                    }
                    week.list_item.push(schedule);
                })
            })
            listWeek.push(week);
        });

        return listWeek;
    }
    useEffect(() => {
        listSchedule.length && setListWeek(getListSchedule());
    }, [listSchedule]);

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

    return (
        <div className="table-view">
            <div className="schedule-header">
                <div className="schedule-select-week">
                    <FormControl fullWidth >
                        <InputLabel id="demo-simple-select-label">Tuần</InputLabel>
                        <Select
                            value={1}
                            label="Tuần"
                            size="small"
                            defaultValue={1}
                        >
                            {data.data.ds_tuan_tkb.map((item, index) => <MenuItem value={item.tuan_hoc_ky}>{`Tuần ${item.tuan_hoc_ky} [từ ngày ${item.ngay_bat_dau} đến ngày ${item.ngay_ket_thuc}]`}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>

            </div>
            {drawEmptyTable()}
            <div className="table-content">
                {listWeek.length > 0 && listWeek[0].list_item.map((item, index) =>
                    renderItem(item))}
            </div>

        </div>
    )
}