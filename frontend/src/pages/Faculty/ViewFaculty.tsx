import { Button, Dialog, DialogContent } from "@mui/material"
import { useEffect, useState } from "react"
import UntilsFunction, { Transition } from "../../utils/UtilsFunction"
import InputValid from "../../components/InputValid"
import { FacultyType } from "../../utils/DataType"
import AxiosClient from "../../api/AxiosClient"

type Form = {
    faculty_id: string,
    name: string,
    email: string,
    phone: string
}

const initForm: Form = {
    faculty_id: "",
    name: "",
    email: "",
    phone: ""
}

const initValid = {
    faculty_id: false,
    name: false,
    email: false,
    phone: false
}

type props = {
    edit: Function,
    open: boolean,
    setOpen: Function,
    data: FacultyType
}

export default function ViewFaculty({ edit, open, setOpen, data }: props) {
    const [dataForm, setDataForm] = useState<FacultyType>(data);
    const [validForm, setValidForm] = useState<any>(initValid);

    useEffect(() => {
        setValidForm({
            faculty_id: dataForm.faculty_id.length > 0,
            name: dataForm.name.length > 0,
            email: dataForm.email?.length === 0 || UntilsFunction.isValidEmail(dataForm.email) || dataForm.email === null,
            phone: dataForm.phone?.length === 0 || UntilsFunction.isValidPhone(dataForm.phone) || dataForm.phone === null
        })
    }, [dataForm])

    function onChangeData(name: string, value: string): void {
        setDataForm({ ...dataForm, [name]: value })
    }

    function onSubmit(): void {
        AxiosClient.put(`faculties/${dataForm.id}`, dataForm).then(() => {
            edit(dataForm);
            UntilsFunction.showToastSuccess('Cập nhật thành công!');
            setTimeout(() => {
                setOpen(false);
            }, 1000)

        }).catch((e) => {
            console.log(e);
            UntilsFunction.showToastError('Đã có lỗi xảy ra');
        })
    }

    function isValidForm(): boolean {
        let key = Object.keys(validForm);

        for (let el of key)
            if (!validForm[el]) return false;
        return true;
    }

    useEffect(() => {
        setDataForm(data);
    }, [data])


    return (
        <Dialog
            open={open}
            keepMounted
            TransitionComponent={Transition}
            fullWidth={true}
            maxWidth='sm'
            onClose={() => { setOpen(false) }}
        >
            <DialogContent className="dialog-account">
                <div className="dialog-account--title">Chỉnh sửa khoa</div>
                <div className="grid grid-cols-2 mt-4 w-full gap-y-4 gap-x-4">
                    <InputValid
                        label={"Mã khoa"} name={"faculty_id"}
                        onChangeData={onChangeData} value={dataForm.faculty_id}
                        isValid={validForm.faculty_id} alert={"Mã khoa không hợp lệ"} disabled={false} />

                    <InputValid
                        label={"Tên khoa"} name={"name"}
                        onChangeData={onChangeData} value={dataForm.name}
                        isValid={validForm.name} alert={"Mã khoa không hợp lệ"} disabled={false} />

                    <InputValid
                        label={"Email"} name={"email"}
                        onChangeData={onChangeData} value={dataForm.email ? dataForm.email : 'Chưa cập nhật'}
                        isValid={validForm.email} alert={"Email không hợp lệ"} disabled={false} />

                    <InputValid
                        label={"Số điện thoại"} name={"phone"}
                        onChangeData={onChangeData} value={dataForm.phone ? dataForm.phone : 'Chưa cập nhật'}
                        isValid={validForm.phone} alert={"Số điện thoại không hợp lệ"} disabled={false} />
                </div>
            </DialogContent>
            <div className="p-4 w-full flex justify-end">
                <Button variant="contained" onClick={onSubmit} disabled={!isValidForm()}> Cập nhật</Button>
            </div>
        </Dialog>
    )
}