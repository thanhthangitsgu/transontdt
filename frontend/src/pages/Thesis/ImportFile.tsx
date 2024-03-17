import { Button, Dialog, DialogContent } from "@mui/material";
import VisuallyHiddenInput from "../../components/VisuallyHiddenInput";
import { ChangeEvent, useState } from "react";
import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";
import { CloudUploadRounded } from "@mui/icons-material";
import readXlsxFile, { Row } from 'read-excel-file'
import { LecturerType, StudentType, ThesisType } from "../../utils/DataType";
import AxiosClient from "../../api/AxiosClient";
import UntilsFunction from "../../utils/UtilsFunction";
import useGet from "../../hook/useGet";
import { LoadingButton } from "@mui/lab";

export type props = {
    open: boolean,
    setOpen: Function,
    setList: Function
}

type DetailVertex = {
    index: number,
    adj: number[],
    color: number
}

export default function ImportFile({ open, setOpen, setList }: props) {
    const [fileName, setFileName] = useState<string>('');
    const [listThesis, setListThesis] = useState<ThesisType[]>([]);
    const [listLecturer, setListLecturer] = useState<LecturerType[]>([]);
    const dataLecturer = useGet('lecturers', false);
    const dataStudent = useGet('students', false);
    const [load, setLoad] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean>(false);

    function handleChangeFile(event: ChangeEvent): void {
        let temp: any = event.target;
        setFileName(`${temp.files[0].name}`)
        readXlsxFile(temp.files[0]).then((row) => {
            setIsValid(isValidFile(row));
            if (!isValidFile(row)) {
                UntilsFunction.showToastError('Cấu hình file không hợp lệ');
                return;
            }

            let listThesis: ThesisType[] = [];
            for (let i = 1; i <= row.length - 3; i += 3) {
                let thesis: ThesisType = {
                    id: `${row[i][0]}`,
                    name: `${row[i][1]}`,
                    student_id: [],
                    student_name: [],
                    lecturer_id: `${row[i][5]}`,
                    lecturer_name: `${row[i][4]}`,
                    board_id: [],
                    board_name: [],
                    time: 'null',
                    date: '2020-01-01',
                    room: 'null',
                    lecturer: ''
                };
                for (let j = 0; j < 3; j++) {
                    if (`${row[i + j][2]}` != 'null') thesis.student_name.push(`${row[i + j][2]}`);
                    if (`${row[i + j][3]}` != 'null') thesis.student_id.push(`${row[i + j][3]}`);
                    if (`${row[i + j][6]}` != 'null') thesis.board_name.push(`${row[i + j][6]}`);
                    if (`${row[i + j][7]}` != 'null') thesis.board_id.push(`${row[i + j][7]}`);
                }
                listThesis.push(thesis);
            };
            setListThesis(listThesis)
        })
    }

    function onSubmit(): void {
        //setList(listThesis);
        setLoad(true);
        let checkIndex: boolean[] = [];
        for (let i = 0; i < listThesis.length; i++) checkIndex.push(false);
        let list: any[] = []

        listThesis.forEach((thesis, index) => {
            let dataThesis = {
                name: thesis.name,
                instructors: thesis.lecturer_id,
                room_id: 12,
                date: '2023-01-01',
                time: 'null',
                semester_id: 1,
                faculty_id: 8,
                list_student: thesis.student_id,
                list_lecturer: thesis.board_id,
            };

            list.push(dataThesis);
        });

        AxiosClient.post('thesis', {
            data: list
        }).then((data) => {
            UntilsFunction.showToastSuccess('Tải lên thành công!');
            setOpen(false);
        }).catch((e) => {
            UntilsFunction.showToastError('Lỗi: ' + e.message);
        })
    }

    function isValidFile(row: Row[]): boolean {
        let header = ['stt', 'ten', 'ten_sinh_vien', 'ma_sinh_vien', 'ten_gvhd', 'ma_gvhd', 'hoi_dong', 'ma_hoi_dong'];
        if (!row[0]) return false;
        for (let i = 0; i < header.length; i++) {
            if (!row[0][i]) return false;
            if (row[0][i] !== header[i]) return false;
        }
        return true;
    }

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth='sm'
            onClose={() => setOpen(false)}
        >
            <DialogContent>
                <div className="dialog-account--title">Import danh sách khóa luận</div>
                <div className="mt-4 mb-4">Lưu ý: File tải lên dựa trên <a href='/excel/thesis.xlsx'><span className="text-[#1565c0] font-semibold">danh sách mẫu</span></a></div>
                <div className="w-full flex items-center justify-center flex-col">
                    <div className="mb-2 italic">{fileName}</div>
                    <Button component="label" variant="contained" startIcon={< FileCopyRoundedIcon />} color="success">
                        Chọn File
                        <VisuallyHiddenInput type="file" onChange={handleChangeFile} />
                    </Button>
                </div>
                <div className="flex w-full justify-end mt-4 gap-4">
                    <Button color="error">Hủy</Button>

                    <LoadingButton
                        loading={load}
                        loadingPosition="start"
                        startIcon={<CloudUploadRounded />}
                        variant="contained"
                        onClick={onSubmit}
                        disabled={!isValid}
                    >
                        Tải lên
                    </LoadingButton>
                </div>
            </DialogContent>
        </Dialog>
    )
}