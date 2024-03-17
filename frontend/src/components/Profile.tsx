import { LoadingButton } from "@mui/lab";
import { Backdrop, Button, CircularProgress, Dialog, DialogContent, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';

import dayjs from "dayjs";
import EditNoteIcon from '@mui/icons-material/EditNote';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { FacultyType, LecturerType, LecturerValidate } from "../utils/DataType";
import UntilsFunction from "../utils/UtilsFunction";
import AxiosClient from "../api/AxiosClient";
import InputValid from "./InputValid";
import AddressSelect from "./AddressSelect";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} timeout={50000} {...props} />;
});

const initForm: LecturerType = {
    email: "",
    first_name: "",
    last_name: "",
    gender: "Nam",
    address: "",
    birthday: "1900-01-01",
    lecturer_id: "",
    id: "",
    phone: "",
    faculty_id: -1,
    is_delete: 0,
    created_at: "",
    updated_at: ""
}

const initValidForm = {
    email: true,
    first_name: true,
    last_name: true,
    gender: true,
    address: true,
    birthday: true,
    faculty: true,
    lecturer_id: true,
    phone: true
}

type props = {
    isOpen: boolean,
    setOpen: Function,
    lecturer: LecturerType,
    listFaculty: FacultyType[]
}

export default function Profiler({ isOpen, setOpen, lecturer, listFaculty }: props) {
    const [dataForm, setDataForm] = useState<LecturerType>(initForm);
    const [validDataForm, setValidDataForm] = useState<LecturerValidate>(initValidForm);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [address, setTextAddress] = useState<string>('');

    useEffect(() => {
        setIsEdit(false);
        setDataForm(lecturer);
        setTextAddress(lecturer.address);
    }, [lecturer])

    useEffect(() => {
        let valid = {
            email: UntilsFunction.isValidEmail(dataForm.email),
            first_name: dataForm.first_name.length > 0,
            last_name: dataForm.last_name.length > 0,
            gender: true,
            address: true,
            birthday: true,
            faculty: dataForm.faculty_id > -1,
            lecturer_id: dataForm.lecturer_id.length > 0,
            phone: UntilsFunction.isValidPhone(dataForm.phone)
        }

        setValidDataForm(valid);
    }, [dataForm])

    function onChangeData(field: string, value: string): void {
        setDataForm({ ...dataForm, [field]: value });
    }

    function onChangeFormControl(event: SelectChangeEvent): void {
        setDataForm({ ...dataForm, [event.target.name]: event.target.value })
    }


    function setAddress(address: string): void {
        setDataForm({ ...dataForm, address: address });
    }

    function updateLecturer(): void {
        setIsLoading(true);
        AxiosClient.put(`lecturers/${dataForm.id}`, dataForm).then((res) => {
            UntilsFunction.showToastSuccess('Cập nhật thông tin thành công!');
            setIsEdit(false);

        }).catch((e) => {
            UntilsFunction.showToastError('Đã xảy ra lỗi!')
        }).finally(() => { setIsLoading(false); })
    }

    return (
        <div className="popup-add-lecturer">
            <div className="popup-confirm">
                <Dialog
                    open={isOpen}
                    keepMounted
                    TransitionComponent={Transition}
                    fullWidth={true}
                    maxWidth='md'
                    onClose={() => setOpen(false)}
                    sx={{ backgroundColor: 'transparent' }}
                >

                    <DialogContent className="dialog-account" sx={{ backgroundColor: 'transparent' }}>
                        <div className="dialog-add-account">
                            <div className="dialog-account--title">Thông tin cá nhân</div>

                            <div className="dialog-account-content">
                                <div className="grid  grid-cols-2 mb-4 gap-8">
                                    <InputValid label="Mã giảng viên: " name='lecturer_id'
                                        isValid={validDataForm.lecturer_id} onChangeData={onChangeData}
                                        value={dataForm.lecturer_id} alert="Vui lòng điền vào trường này"
                                        disabled={!isEdit} />

                                    <InputValid label="Email: " name="email"
                                        isValid={validDataForm.email} onChangeData={onChangeData}
                                        value={dataForm.email} alert="Email không hợp lệ"
                                        disabled={!isEdit} />
                                </div>
                                <div className="grid  grid-cols-2 mb-4 gap-8">
                                    <InputValid label="Họ lót: " name='last_name'
                                        isValid={validDataForm.last_name} onChangeData={onChangeData}
                                        value={dataForm.last_name} alert="Vui lòng điền vào trường này"
                                        disabled={!isEdit} />

                                    <InputValid label="Tên: " name="first_name"
                                        isValid={validDataForm.first_name} onChangeData={onChangeData}
                                        value={dataForm.first_name} alert="Email không hợp lệ"
                                        disabled={!isEdit} />
                                </div>

                                <div className="grid  grid-cols-2 mb-4 gap-8">
                                    <div className="input-valid">
                                        <div className="">
                                            <div className="input-valid__label flex">
                                                <label htmlFor=""> Ngày sinh:  </label>
                                            </div>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker disabled={!isEdit} className="date-picker" format="DD/MM/YYYY" value={dayjs(dataForm.birthday)} onChange={() => setDataForm({ ...dataForm, birthday: dayjs(dataForm.birthday).format('YYYY-MM-DD') })} />
                                            </LocalizationProvider>
                                        </div>
                                    </div>
                                    <div className="input-valid ">
                                        <div className="">
                                            <div className="input-valid__label flex">
                                                <label htmlFor=""> Giới tính:  </label>
                                            </div>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    className="select-address"
                                                    sx={{ width: '14.5rem' }}
                                                    defaultValue={`Nam`}
                                                    value={`${dataForm.gender}`}
                                                    onChange={onChangeFormControl}
                                                    name='gender'
                                                    disabled={!isEdit}
                                                >
                                                    <MenuItem value={'Nam'}>Nam</MenuItem>
                                                    <MenuItem value={'Nữ'}>Nữ</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>

                                </div>
                                <div className="grid  grid-cols-2 mb-4 gap-8">
                                    <InputValid label="Số điện thoại: " name='phone'
                                        isValid={validDataForm.phone} onChangeData={onChangeData}
                                        value={dataForm.phone} alert="Vui lòng điền vào trường này"
                                        disabled={!isEdit} />

                                    <div className="input-valid mt-2">
                                        <div className="">
                                            <div className="input-valid__label flex">
                                                <label htmlFor=""> Khoa:  </label>
                                            </div>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    className="select-address"
                                                    sx={{ width: '14.5rem' }}
                                                    defaultValue={`${0}`}
                                                    name='faculty_id'
                                                    onChange={onChangeFormControl}
                                                    disabled={!isEdit}
                                                    value={`${dataForm.faculty_id}`}
                                                >
                                                    {listFaculty.map((item, index) => <MenuItem value={item.id} key={index}>{item.name}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-valid">
                                    <div >
                                        <div className="input-valid__label flex">
                                            <label htmlFor=""> Nơi sinh:  </label>
                                        </div>
                                        <AddressSelect textAddress={lecturer.address} setAddress={setAddress} disabled={!isEdit} />
                                    </div>
                                </div>

                            </div>
                            <div className="dialog-account-action">
                                {isEdit && (
                                    <>
                                        <LoadingButton disabled={isLoading} onClick={() => {
                                            setDataForm(lecturer);
                                            setIsEdit(false)
                                        }} color="error" >
                                            <span>Hủy</span>
                                        </LoadingButton>

                                        <LoadingButton sx={{
                                            backgroundColor: '#1976d2', '&:hover': {
                                                backgroundColor: '#1565c0'
                                            },
                                            '&:disabled': {
                                                backgroundColor: '#42a5f5',
                                                color: 'white'
                                            }
                                        }}
                                            startIcon={<  SaveAsIcon />}
                                            variant="contained"
                                            loading={isLoading}
                                            disabled={isLoading || !UntilsFunction.isValidForm(validDataForm)}
                                            onClick={updateLecturer}
                                            loadingPosition="start"
                                        >
                                            <span>Lưu thông tin</span>
                                        </LoadingButton>
                                    </>
                                )}
                                {!isEdit && (
                                    <Button startIcon={< EditNoteIcon />} variant="contained" onClick={() => setIsEdit(true)} >
                                        <span>Sửa thông tin</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div >
    )
}