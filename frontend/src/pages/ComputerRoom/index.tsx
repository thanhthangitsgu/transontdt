import { ReactNode, useEffect, useState } from "react";
import useGet from "../../hook/useGet"
import dayjs from "dayjs";
import { ClassroomType, ConfigColumn, ItemClassRoom, LecturerType, Position, RoomTime, TimeType, WeekType } from "../../utils/DataType";
import { Box, Chip, FormControl, IconButton, InputLabel, LinearProgress, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import PopupRequest from "./PopupRequest";
import Table from "../../components/table/Table";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import DoDisturbAltOutlinedIcon from '@mui/icons-material/DoDisturbAltOutlined';
import AxiosClient from "../../api/AxiosClient";
import UntilsFunction from "../../utils/UtilsFunction";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ScheduleRoom from "./ScheduleRoom";

type Status = {
    id: string,
    status: number[],
    time: TimeType[],
    room: ClassroomType
}

type DataRequest = {
    room: number,
    label: string,
    day: number,
    time: number,
    detail: string,
    id_time: number[],
    session: number,
    empty: string[]
}

export default function ComputerRoom() {
    const dataRoom = useGet('classrooms', false);
    const dataTime = useGet('times', false);
    const [listWeek, setListWeek] = useState<WeekType[]>([]);
    const [listComputerStatus, setListStatus] = useState<Status[]>([]);
    const [listRow, setListRow] = useState<ConfigColumn[][]>([]);
    const [reLoad, setReload] = useState<number>(0);
    const profile = useSelector<RootState, LecturerType>(state => state.profile);
    const [dataWeek, setDataWeek] = useState<ItemClassRoom[]>([]);
    const [detailRoom, setDetailRoom] = useState<ItemClassRoom>({
        week: 1,
        id: 1,
        label: '1',
        day: [],
    });

    let startTime = '2023-09-04';
    let current = dayjs();
    let hours = current.diff(startTime, 'hour');

    const days = Math.floor(hours / 168) + 1;
    const [week, setWeek] = useState<number>(days);
    const dataRoomTime = useGet(`classroom-time/${week}`, false, reLoad);
    const [popupRq, setPopupRq] = useState<boolean>(false);
    const [dataRequest, setDataRequest] = useState<DataRequest>({
        room: 1,
        label: '',
        day: 1,
        time: 1,
        detail: '',
        id_time: [],
        session: 0,
        empty: []

    });
    const [listRoom, setListRoom] = useState<ClassroomType[]>([]);
    const [listRoomTime, setListRoomTime] = useState<RoomTime[]>([]);
    const [type, setType] = useState<number>(0);
    const [openPopupView, setOpenView] = useState<boolean>(false);

    useEffect(() => {
        getWeek();
        getListWeek();
    }, [])

    useEffect(() => {
        if (!dataRoomTime.response) return;
        if (!dataRoom.response) return;

        let temp: ClassroomType[] = dataRoom.response;
        let listRoomTime: TimeType[] = dataRoomTime.response;
        let statusList: Status[] = [];
        let listRoom = temp.filter((item) => `${item.is_computer_room}` === '1');
        setListRoom(listRoom);

        console.log(listRoomTime);


        listRoom.map((item, index) => {
            let status: Status = {
                id: item.label,
                status: [],
                time: [],
                room: item
            };
            let list = listRoomTime.filter((time) => `${time.classroom_id}` === `${item.id}` && `${time.status}` === `${1}`);

            list.map((element, index) => {
                status.time.push({
                    time_id: element.time_id,
                    hour: element.hour,
                    day: element.day,
                    week: element.week,
                    classroom_id: item.id,
                    id: item.id,
                    status: element.status,
                    note: element.note,
                    lecturer_first_name: element.lecturer_first_name,
                    lecturer_last_name: element.lecturer_last_name,
                })
            });
            statusList.push(status);
        });

        statusList.map((status) => status.status = getStatus(status.time));
        setListStatus(statusList);

        let listTemp: ItemClassRoom[] = [];
        listRoom.map((item, index) => {
            let itemClassRoom: ItemClassRoom = {
                week: week,
                id: item.id,
                label: item.label,
                day: []
            };
            for (let i = 0; i < 12; i++) itemClassRoom.day.push([]);
            let dayList = listRoomTime.filter((roomTime, ind) => `${roomTime.classroom_id}` === `${item.id}` && `${roomTime.status}` === `${1}`);
            console.log(dayList, 'day list');

            for (let i = 0; i < dayList.length; i += 1) {
                if (parseInt(`${dayList[i].hour}`) <= 5) itemClassRoom.day[parseInt(`${dayList[i].day - 1}`) * 2].push(dayList[i]);
                else itemClassRoom.day[parseInt(`${dayList[i].day - 1}`) * 2 + 1].push(dayList[i]);
            }
            listTemp.push(itemClassRoom);
        });

        setDataWeek(listTemp);
        console.log(listTemp, 'listtemp');

        setDetailRoom(listTemp[0]);
    }, [dataRoomTime.response, dataRoom.response]);

    useEffect(() => {
        if (!dataRoomTime) return;
        setListRoomTime(dataRoomTime.response);
    }, [dataRoomTime.response]);

    useEffect(() => {
        if (listRoomTime) getListRow(false);
    }, [listRoomTime, listRoom])

    function getStatus(time: TimeType[]): number[] {
        let defaultStatus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (let i = 0; i < defaultStatus.length; i += 2) {
            let list = time.filter((item) => `${item.day}` === `${Math.floor(i / 2) + 1}`);

            if (list.filter((item) => item.hour <= 5).length > 0) defaultStatus[i] = 1;
            if (list.filter((item) => item.hour > 5).length > 0) defaultStatus[i + 1] = 1;
        };
        return defaultStatus;
    }

    function getWeek(): void {
        let current = dayjs();
        let hours = current.diff(startTime, 'hour');
        const days = Math.floor(hours / 168) + 1;
        setWeek(days);
    }

    function getListWeek(): void {
        let listWeek: WeekType[] = [];
        let current = dayjs(startTime);
        while (listWeek.length < 19) {
            let week: WeekType = {
                id: listWeek.length,
                startTime: current.format('DD/MM/YYYY'),
                endTime: current.add(6, 'day').format('DD/MM/YYYY')
            }
            current = current.add(7, 'day');
            listWeek.push(week);
        }
        setListWeek(listWeek);
    }

    function handleOnChangeWeek(event: SelectChangeEvent<number>): void {
        setWeek(parseInt(`${event.target.value}`));
    }

    function onClick(room: ItemClassRoom, day: number, time: number, session: number, timeType: TimeType[]): void {
        if (timeType.length === 5) {
            UntilsFunction.showToastError('Đã hết thời gian trống!');
            return;
        }
        let empty = session ? [6, 7, 8, 9, 10] : [1, 2, 3, 4, 5];
        timeType.map((detail, id) => {
            let index = empty.findIndex((item) => parseInt(`${detail.hour}`) === item || parseInt(`${detail.hour}`) % 5 === item);
            if (index >= 0) empty.splice(index, 1);
        });

        let emptyString: string[] = [];
        empty.map((item) => emptyString.push(`${item}`));

        let weekDetail = listWeek.find((item) => item.id === week - 1);
        let detailText = `Thứ ${day + 1} `;
        if (weekDetail) detailText += dayjs(weekDetail.startTime.split('/').reverse().join('-')).add(day - 1, 'day').format('DD/MM/YYYY');
        let listIdTime: number[] = [];
        if (session) for (let i = 6; i <= 10; i++) listIdTime.push(getIdTime(day, i));
        else for (let i = 1; i <= 5; i++) listIdTime.push(getIdTime(day, i));
        let detail: DataRequest = {
            room: room.id,
            label: room.label,
            day: day,
            time: time,
            detail: detailText,
            id_time: listIdTime,
            session: session,
            empty: emptyString

        };

        setDataRequest(detail);
        setPopupRq(true);
    }

    function getDetailDay(time: TimeType | null): string {
        if (!time) return '';
        let day = parseInt(`${time.day}`);

        let weekDetail = listWeek.find((item) => item.id === week - 1);
        let detailText = `${time.hour <= 5 ? 'Sáng' : 'Chiều'} thứ ${day + 1} `;
        if (weekDetail) detailText += dayjs(weekDetail.startTime.split('/').reverse().join('-')).add(day - 1, 'day').format('DD/MM/YYYY');
        return detailText;
    }

    const configWidth: number[] = [10, 10, 20, 25, 25, 10];

    //Defind colums
    let columns: ConfigColumn[] = [
        { element: <span>Phòng</span>, position: Position.Center },
        { element: <span>Trạng thái</span>, position: Position.Center },
        { element: <span>Thời gian</span>, position: Position.Center },
        { element: <span>Người mượn</span>, position: Position.Center },
        { element: <span>Lý do</span>, position: Position.Center },
        { element: <span>Tác vụ</span>, position: Position.Center },
    ];


    function getRow(confirm: string, label: string, time: string, lecturer: string, note: string, action: ReactNode): ConfigColumn[] {
        return [
            { element: <span>{label}</span>, position: Position.Center },
            { element: <span>{confirm === '1' ? <Chip label="Đã duyệt" color="primary" variant="outlined" /> : <Chip label="Đang chờ" color="secondary" variant="outlined" />}</span>, position: Position.Center },
            { element: <span>{time}</span>, position: Position.Center },
            { element: <span>{lecturer}</span>, position: Position.Center },
            { element: <span>{note}</span>, position: Position.Center },
            { element: action, position: Position.Center }
        ];
    }

    function getListRow(disable: boolean): void {
        let rows: ConfigColumn[][] = [];
        listRoomTime.sort((a, b) => parseInt(`${a.status}`) - parseInt(`${b.status}`));
        for (let status of listRoomTime) {
            if (profile.lecturer_id !== '' && status.lecturer_id !== profile.lecturer_id) continue;
            let action =
                <div>
                    <IconButton color="success" onClick={() => setConfirm(1, status)} disabled={`${status.status}` === '1' || profile.lecturer_id !== ''}><PlaylistAddCheckOutlinedIcon /></IconButton>
                    <IconButton color="error" onClick={() => setConfirm(-1, status)} disabled={profile.lecturer_id !== ''}><DoDisturbAltOutlinedIcon /></IconButton>
                </div>
            rows.push(getRow(`${status.status}`, getRoom(status.classroom_id), getDetailDay(getTime(status.time_id)), `${status.lecturer_last_name} ${status.lecturer_first_name} `, status.note, action));
        };
        setListRow(rows);
    }

    function getRoom(id: string): string {
        let item = listRoom.find((room) => `${room.id} ` === `${id} `);

        if (!item) return 'Lỗi cập nhật';
        return item.label;
    }

    function getIdTime(day: number, hour: number): number {
        if (!dataTime.response) return 1;
        let list: TimeType[] = dataTime.response;

        let item = list.find((item) => `${item.day}` === `${day}` && item.hour.toString() === hour.toString() && item.week.toString() === week.toString());
        if (!item) return 1;

        return item.id;
    }

    function getTime(id_time: string): TimeType | null {
        if (!dataTime.response) return null;
        let list: TimeType[] = dataTime.response;
        let item = list.find((item) => `${item.id} ` === `${id_time} `);
        if (!item) return null;
        return item;
    }

    function onChange(event: SelectChangeEvent<number>): void {
        setType(parseInt(`${event.target.value} `));
    }

    function setConfirm(confirm: number, roomTime: RoomTime): void {
        AxiosClient.put('classroom-time/update', {
            classroom_id: roomTime.classroom_id,
            list_id_time: [roomTime.time_id],
            note: roomTime.note,
            lecturer_id: roomTime.lecturer_id,
            status: confirm
        }).then(() => {
            UntilsFunction.showToastSuccess('Cập nhật thành công');
            setReload(Math.random());
        }).catch((e) => {
            UntilsFunction.showToastError(`Lỗi: ${e.message}`);
        })
    }

    function getDetailItem(day: TimeType[], session: number): ReactNode {
        let empty = session ? [6, 7, 8, 9, 10] : [1, 2, 3, 4, 5];
        day.map((detail, id) => {
            let index = empty.findIndex((item) => parseInt(`${detail.hour}`) === item || parseInt(`${detail.hour}`) % 5 === item);
            if (index >= 0) empty.splice(index, 1);
        });

        return (<div className="detail-computer-room">
            {day.map((detail, id) =>
                <p className="text-left ml-2">{`${detail.lecturer_last_name.split(' ').reduce((prev, current) => prev[0] + '.' + current[0] + '.')}${detail.lecturer_first_name} (${detail.hour}): ${detail.note}`}
                </p>)}
            <p className="text-left ml-2">Tiết còn trống: {empty.length === 0 ? 'Không có' : empty.join(',')}</p>
        </div>)
    }

    return (
        <div className="page">
            <PopupRequest open={popupRq} setOpen={setPopupRq} detail={dataRequest} callBack={() => setReload(Math.random())} />
            <ScheduleRoom dataRoom={detailRoom} open={openPopupView} setOpen={setOpenView} />
            <div className="page-content">
                <div className="page-header flex gap-4">
                    <FormControl sx={{ width: '25rem' }} size="small">
                        <InputLabel id="Tuần">Kiểu xem</InputLabel>
                        <Select
                            label="Kiểu xem"
                            onChange={onChange}
                            value={type}
                        >
                            <MenuItem value={0}>Xem lịch</MenuItem>
                            <MenuItem value={1}>Xem yêu cầu</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: '25rem' }} size="small">
                        <InputLabel id="Tuần">Tuần</InputLabel>
                        <Select
                            label="Tuần"
                            value={week}
                            defaultValue={1}
                            onChange={handleOnChangeWeek}
                        >
                            {listWeek.map((item, index) => <MenuItem key={index} value={item.id + 1}>{`Tuần ${item.id + 1} (từ ngày ${item.startTime} đến ${item.endTime})`}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
                <section id="room" className="computer-room mt-2">
                    {type === 0 && (
                        <>
                            <table className="table-computer-room">
                                <tr>
                                    <th rowSpan={2}>Phòng</th>
                                    <th colSpan={2}>Thứ hai</th>
                                    <th colSpan={2}>Thứ ba</th>
                                    <th colSpan={2}>Thứ tư</th>
                                    <th colSpan={2}>Thứ năm</th>
                                    <th colSpan={2}>Thứ sáu</th>
                                    <th colSpan={2}>Thứ bảy</th>
                                </tr>
                                <tr>
                                    <th>Sáng</th>
                                    <th>Chiều</th>
                                    <th>Sáng</th>
                                    <th>Chiều</th>
                                    <th>Sáng</th>
                                    <th>Chiều</th>
                                    <th>Sáng</th>
                                    <th>Chiều</th>
                                    <th>Sáng</th>
                                    <th>Chiều</th>
                                    <th>Sáng</th>
                                    <th>Chiều</th>
                                </tr>
                                <tbody>
                                    {dataWeek.map((data, ind) => {
                                        return (
                                            <tr>
                                                <td onClick={() => {
                                                    setDetailRoom(data)
                                                    setOpenView(true)
                                                }}>{data.label}</td>
                                                {data.day.map((day, index) => {
                                                    return (
                                                        <td className="item-computer-room">
                                                            <IconButton
                                                                color={day.length === 5 ? 'warning' : 'primary'}
                                                                onClick={() => onClick(data, Math.floor(index / 2) + 1, index % 2 ? 6 : 1, index % 2, day)}
                                                                className="button-item-computer">
                                                                <LayersRoundedIcon />
                                                            </IconButton>
                                                            {getDetailItem(day, index % 2)}
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            {!listComputerStatus.length && (
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress />
                                </Box>
                            )}
                        </>
                    )}
                    {type === 1 && (
                        <Table
                            configWidth={configWidth}
                            columns={columns}
                            rows={listRow}
                            isLoad={false}
                            listDelete={[]}
                            setListDelete={() => { }}
                            listStatusCheck={[]}
                            setListStatusCheck={() => { }}
                            isCheckAll={false}
                            setOpenPopupDeletes={() => { }}
                            isCheck={false} />
                    )}

                </section>
            </div>
        </div>
    )
}