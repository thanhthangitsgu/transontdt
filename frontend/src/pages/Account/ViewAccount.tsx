import { useEffect, useState } from "react"
import { FacultyType, LecturerType, RoleType, StudentType } from "../../utils/DataType"
import { AccountLogin } from "../Login";
import { Dialog, DialogContent } from "@mui/material";
import AxiosClient from "../../api/AxiosClient";
import useGet from "../../hook/useGet";

type props = {
    id: string,
    open: boolean,
    setOpen: Function
}
export default function ViewAccount({ id, open, setOpen }: props) {
    const [dataStudent, setDataStudent] = useState<StudentType>();
    const [dataLecturer, setDataLecturer] = useState<LecturerType>();
    const [dataAccount, setDataAccount] = useState<any>();
    let dataRole = useGet('roles', false);
    let dataFaculty = useGet('faculties', false);

    useEffect(() => {
        fetch(id);
    }, [id,]);

    async function fetch(id: string) {
        if (id === '') return;
        let res = await AxiosClient.get(`accounts/${id}`);
        res.data.data.role_id = parseInt(res.data.data.role_id);
        setDataAccount(res.data.data);

        let lecturer: any;

        if (res.data.data.role_id === 3) lecturer = await AxiosClient.get(`lecturers/${id}`);
        if (lecturer?.data) setDataLecturer(lecturer.data.data);
        console.log(lecturer);



        let student: any;
        if (res.data.data.role_id === 2) student = await AxiosClient.get(`students/${id}`);
        if (student?.data) setDataStudent(student.data.data);
        console.log(student);
        console.log(res.data.data.role_id);

    };

    useEffect(() => {
    }, [dataLecturer, dataStudent]);

    function getRole(id: number): string {
        if (!dataRole.response) return 'loading...';
        let listRole: RoleType[] = dataRole.response;

        let role = listRole.find((item) => item.id === id);
        if (!role) return 'Lỗi cập nhật';
        return role.name;
    }

    function getFaculty(id: number): string {
        if (!dataFaculty.response) return 'loading...';
        let listFaculty: FacultyType[] = dataFaculty.response;

        let role = listFaculty.find((item) => item.id === id);
        if (!role) return 'Lỗi cập nhật';
        return role.name;
    }

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth='sm'
            fullWidth
        >
            <DialogContent>
                <div className="dialog-account--title">Thông tin người dùng</div>
                {dataAccount && (
                    <div className="w-full">
                        <div className="grid grid-cols-2 mt-4 gap-4">
                            <div><span className="font-semibold">Vai trò: </span> <span className="text-[#1565c0]">{getRole(dataAccount.role_id)}</span></div>
                            <div><span className="font-semibold">Email: </span> <span className="text-[#1565c0]">{dataAccount ? dataAccount.email : 'loading...'}</span></div>

                            {dataAccount.role_id === 3 && (
                                <>
                                    <div><span className="font-semibold">Họ và tên: </span> <span className="text-[#1565c0]">{dataLecturer ? `${dataLecturer.last_name} ${dataLecturer.first_name}` : 'loading...'}</span></div>
                                    <div><span className="font-semibold">Số điện thoại: </span> <span className="text-[#1565c0]">{dataLecturer ? dataLecturer.phone : 'loading...'}</span></div>
                                    <div><span className="font-semibold">Mã số: </span> <span className="text-[#1565c0]">{dataLecturer ? dataLecturer.lecturer_id : 'loading...'}</span></div>
                                    <div><span className="font-semibold">Khoa: </span> <span className="text-[#1565c0]">{dataLecturer ? getFaculty(dataLecturer?.faculty_id) : 'loading...'}</span></div>
                                </>
                            )}
                            {dataAccount.role_id === 2 && (
                                <>
                                    <div><span className="font-semibold">Họ và tên: </span> <span className="text-[#1565c0]">{dataStudent ? `${dataStudent.last_name} ${dataStudent.first_name}` : 'loading...'}</span></div>
                                    <div><span className="font-semibold">Số điện thoại: </span> <span className="text-[#1565c0]">{dataStudent ? dataStudent.phone : 'loading...'}</span></div>
                                    <div><span className="font-semibold">Mã số: </span> <span className="text-[#1565c0]">{dataStudent ? dataStudent.student_id : 'loading...'}</span></div>
                                    <div><span className="font-semibold">Khoa: </span> <span className="text-[#1565c0]">{dataStudent ? getFaculty(dataStudent?.faculty_id) : 'loading...'}</span></div>
                                </>
                            )}

                        </div>
                    </div>
                )}

            </DialogContent>
        </Dialog>
    )
}