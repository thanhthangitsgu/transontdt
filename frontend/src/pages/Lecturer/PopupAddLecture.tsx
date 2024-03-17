import { LoadingButton } from "@mui/lab";
import { Dialog, DialogContent, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Slide } from "@mui/material";
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import { TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useState } from "react";
import InputValid from "../../components/InputValid";
import UntilsFunction from "../../utils/UtilsFunction";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import AddressOption from "../../components/AddressOption";
import dayjs from "dayjs";
import AxiosClient from "../../api/AxiosClient";
import { FacultyType, LecturerPost, LecturerType, LecturerValidate } from "../../utils/DataType";
import AddressSelect from "../../components/AddressSelect";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} timeout={50000} {...props} />;
});

const initForm: LecturerType = {
    lecturer_id: "",
    first_name: "",
    last_name: "",
    email: "",
    gender: "Nam",
    birthday: "1950-01-01",
    address: "",
    phone: "",
    id: "",
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
    faculty_id: true,
    lecturer_id: true,
    phone: true
}

type props = {
    isOpen: boolean,
    setOpen: Function,
    action: Function,
    listFaculty: FacultyType[]
}

export default function PopupAddLecturer({ isOpen, setOpen, action, listFaculty }: props) {
    const [dataForm, setDataForm] = useState<LecturerType>(initForm);
    const [validDataForm, setValidDataForm] = useState<any>(initValidForm);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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

    function setAddress(address: string): void {
        setDataForm({ ...dataForm, address: address });
    }

    function onChangeData(field: string, value: string): void {
        setDataForm({ ...dataForm, [field]: value });
    }

    function onChangeFormControl(event: SelectChangeEvent<any>): void {
        setDataForm({ ...dataForm, [event.target.name]: event.target.value })
    }

    function addAccount(): void {
        setIsLoading(true);
        AxiosClient.post('lecturers', { data: [dataForm] }).then((response) => {
            UntilsFunction.showToastSuccess('Thêm giảng viên thành công!');
            setDataForm(initForm);
            setIsLoading(false);
            action(response.data.data);
            setOpen(false);
            setTimeout(() => {

            }, 200);

        }).catch((e) => {
            console.log('Error when add lecturer', e);
            UntilsFunction.showToastError('Đã có lỗi xảy ra!');
            setIsLoading(false);
        })
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
                >
                    <DialogContent className="dialog-account">
                        <div className="dialog-add-account">
                            <div className="dialog-account--title">Thêm giảng viên</div>
                            <div className="dialog-account-content">
                                <div className="grid  grid-cols-2 mb-4 gap-8">
                                    <InputValid label="Mã giảng viên: " name='lecturer_id'
                                        isValid={validDataForm.lecturer_id} onChangeData={onChangeData}
                                        value={dataForm.lecturer_id} alert="Vui lòng điền vào trường này"
                                        disabled={false} />

                                    <InputValid label="Email: " name="email"
                                        isValid={validDataForm.email} onChangeData={onChangeData}
                                        value={dataForm.email} alert="Email không hợp lệ"
                                        disabled={false} />
                                </div>
                                <div className="grid  grid-cols-2 mb-4 gap-8">
                                    <InputValid label="Họ lót: " name='last_name'
                                        isValid={validDataForm.last_name} onChangeData={onChangeData}
                                        value={dataForm.last_name} alert="Vui lòng điền vào trường này"
                                        disabled={false} />

                                    <InputValid label="Tên: " name="first_name"
                                        isValid={validDataForm.first_name} onChangeData={onChangeData}
                                        value={dataForm.first_name} alert="Email không hợp lệ"
                                        disabled={false} />
                                </div>

                                <div className="grid  grid-cols-2 mb-4 gap-8">
                                    <div className="input-valid">
                                        <div className="">
                                            <div className="input-valid__label flex">
                                                <label htmlFor=""> Ngày sinh:  </label>
                                            </div>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker className="date-picker" format="DD/MM/YYYY" value={dayjs(dataForm.birthday)} onChange={() => setDataForm({ ...dataForm, birthday: dayjs(dataForm.birthday).format('YYYY-MM-DD') })} />
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
                                        disabled={false} />

                                    <div className="input-valid mt-2">
                                        <div className="">
                                            <div className="input-valid__label flex">
                                                <label htmlFor=""> Khoa:  </label>
                                            </div>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    className="select-address"
                                                    sx={{ width: '14.5rem' }}
                                                    defaultValue={-1}
                                                    name='faculty_id'
                                                    onChange={onChangeFormControl}
                                                    value={dataForm.faculty_id}
                                                >
                                                    <MenuItem value={-1}> Chọn khoa</MenuItem>
                                                    {listFaculty.map((item, index) => <MenuItem value={item.id}>{item.name}</MenuItem>)}
                                                </Select>


                                            </FormControl>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-valid">
                                    <div >
                                        <div className="input-valid__label flex">
                                            <label htmlFor=""> Quê quán:  </label>
                                        </div>
                                        <AddressSelect textAddress={"Hà Nội-Ba Vì-Ba Trại"} setAddress={setAddress} disabled={false} />
                                    </div>
                                </div>

                            </div>
                            <div className="dialog-account-action">
                                <LoadingButton sx={{
                                    backgroundColor: '#1976d2', '&:hover': {
                                        backgroundColor: '#1565c0'
                                    },
                                    '&:disabled': {
                                        backgroundColor: '#42a5f5',
                                        color: 'white'
                                    }
                                }}
                                    className="dialog-password--button-close"
                                    startIcon={< PersonAddAltRoundedIcon />}
                                    variant="contained"
                                    loading={isLoading}
                                    disabled={isLoading || !UntilsFunction.isValidForm(validDataForm)}
                                    onClick={addAccount}
                                    loadingPosition="start"
                                >
                                    <span>Thêm giảng viên</span>
                                </LoadingButton>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}