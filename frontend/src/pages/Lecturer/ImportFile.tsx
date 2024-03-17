import { Button, Dialog, DialogContent } from "@mui/material";
import VisuallyHiddenInput from "../../components/VisuallyHiddenInput";
import { ChangeEvent, useState } from "react";
import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";
import { CloudUploadRounded } from "@mui/icons-material";
import readXlsxFile, { Row } from 'read-excel-file'
import { FacultyType, LecturerType, ThesisType } from "../../utils/DataType";
import AxiosClient from "../../api/AxiosClient";
import dayjs from "dayjs";
import UntilsFunction from "../../utils/UtilsFunction";
import { LoadingButton } from "@mui/lab";
import useGet from "../../hook/useGet";
import InputValid from "../../components/InputValid";

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
    const [listLecturer, setListLecturer] = useState<LecturerType[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    const dataFaculty = useGet('faculties', false);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');

    function handleChangeFile(event: ChangeEvent): void {
        let temp: any = event.target;
        let listLecturer: LecturerType[] = [];
        setFileName(`${temp.files[0].name}`)

        readXlsxFile(temp.files[0]).then((row) => {
            setIsValid(isValidFile(row));
            if (!isValidFile(row)) {
                UntilsFunction.showToastError('Cấu hình file không hợp lệ!');
                return;
            }

            for (let i = 1; i < row.length; i++) {
                let lecturer: LecturerType = {
                    id: "",
                    lecturer_id: `${row[i][0]}`,
                    first_name: `${row[i][2]}`,
                    last_name: `${row[i][1]}`,
                    email: `${row[i][3]}`,
                    gender: `${row[i][5]}`,
                    birthday: dayjs(`${row[i][4]}`).format('YYYY-MM-DD'),
                    address: `${row[i][8]}-${row[i][9]}-${row[i][10]}`,
                    phone: `${row[i][6]}`,
                    faculty_id: getFaculty(`${row[i][7]}`),
                    is_delete: 0,
                    created_at: "",
                    updated_at: ""
                };

                listLecturer.push(lecturer);
            };
        });
        setListLecturer(listLecturer);
    }

    function getFaculty(name: string): number {
        if (!dataFaculty.response) return 1;
        let listFaculty: FacultyType[] = dataFaculty.response;
        let item = listFaculty.find((element) => element.name.toUpperCase().trim() === name.toUpperCase().trim());
        if (item) return item.id;
        return 1;
    }

    async function onSubmit(): Promise<void> {
        //Post thesis
        setLoad(true)
        await AxiosClient.post('lecturers', {
            data: listLecturer,
            password: password
        })
        setLoad(false);
        setList();
        UntilsFunction.showToastSuccess('Tải lên thành công!');
        setOpen(false);
    }

    function isValidFile(row: Row[]): boolean {
        let header = ['id', 'ho_lot', 'ten', 'email', 'ngay_sinh', 'gioi_tinh', 'sdt', 'khoa', 'tinh', 'huyen', 'xa'];
        if (!row[0]) return false;
        for (let i = 0; i < header.length; i++) {
            if (!row[0][i]) return false;
            if (row[0][i] !== header[i]) return false;
        }
        return true;
    }

    function onChangePassword(name: string, value: string): void {
        setPassword(value)
    }

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth='sm'
            onClose={() => {
                setOpen(false);
            }}
        >
            <DialogContent>
                <div className="dialog-account--title">Import danh sách giảng viên</div>
                <div className="mt-4 mb-4">Lưu ý: File tải lên dựa trên <a href='/excel/lecturers.xlsx'><span className="text-[#1565c0] font-semibold">danh sách mẫu</span></a></div>
                <div className="w-full flex items-center justify-center flex-col">
                    <div className="mb-2 italic">{fileName}</div>
                    <Button component="label" variant="contained" startIcon={< FileCopyRoundedIcon />} color="success">
                        Chọn File
                        <VisuallyHiddenInput type="file" onChange={handleChangeFile} />
                    </Button>
                </div>
                <div className="mt-8" >
                    <InputValid label={"Mật khẩu"} name={"password"} onChangeData={onChangePassword} value={password} isValid={password.length >= 8} alert={""} disabled={false} />
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