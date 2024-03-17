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
import { FacultyType, MajorType, StudentType } from "../../utils/DataType";
import AddressSelect from "../../components/AddressSelect";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} timeout={50000} {...props} />;
});


const initFormStudent: StudentType = {
    email: "test",
    first_name: "",
    last_name: "",
    gender: "Nam",
    address: "",
    birthday: "1900-01-01",
    faculty_id: -1,
    student_id: "",
    id: '',
    phone: '',
    major_id: -1,
    created_at: '',
    updated_at: '',
    is_deleted: 0
}

const initValidForm = {
    email: true,
    first_name: true,
    last_name: true,
    gender: true,
    address: true,
    birthday: true,
    faculty: true,
    student_id: true,
    phone: true
}

type props = {
    isOpen: boolean,
    setOpen: Function,
    action: Function,
    listFaculty: FacultyType[],
    listMajor: MajorType[]
}

const listFaculty = [
    { id: 0, name: 'Công nghệ Thông tin' },
    { id: 1, name: 'Giáo dục Chính trị' },
    { id: 2, name: 'Giáo dục Mầm non' },
    { id: 3, name: 'Quản trị Kinh doanh' },
    { id: 4, name: 'Giáo dục Tiểu học' }

]

export default function PopupAddStudent({ isOpen, setOpen, action, listFaculty, listMajor }: props) {
    const [dataForm, setDataForm] = useState<StudentType>(initFormStudent);
    const [validDataForm, setValidDataForm] = useState<any>(initValidForm);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [listLocalMajor, setListLocalMajor] = useState<MajorType[]>([]);

    useEffect(() => {
        let list: MajorType[] = [];
        list = listMajor.filter((item) => parseInt(`${item.faculty_id}`) === dataForm.faculty_id);
        console.log(list);

        setListLocalMajor(list);
    }, [listMajor, dataForm.faculty_id]);

    useEffect(() => {
        let valid = {
            email: UntilsFunction.isValidEmail(dataForm.email),
            first_name: dataForm.first_name.length > 0,
            last_name: dataForm.last_name.length > 0,
            gender: true,
            address: true,
            birthday: true,
            faculty: true,
            student_id: dataForm.student_id.length > 0,
            phone: UntilsFunction.isValidPhone(dataForm.phone)
        }
        setValidDataForm(valid);
        console.log(dataForm);

    }, [dataForm])

    function setAddress(address: string): void {
        setDataForm({ ...dataForm, address: address });
    }

    function onChangeData(field: string, value: string): void {
        setDataForm({ ...dataForm, [field]: value });
    }

    function onChangeFormControl(event: SelectChangeEvent): void {
        console.log(event.target.name);
        setDataForm({ ...dataForm, [event.target.name]: event.target.value })
    }

    function addAccount(): void {
        setIsLoading(true);
        AxiosClient.post('students', {data: [dataForm]}).then((response) => {
            UntilsFunction.showToastSuccess('Thêm sinh viên thành công!');
            setDataForm(initFormStudent);
            setIsLoading(false);
            action(response.data.data);
            setOpen(false);
            setTimeout(() => {

            }, 200);

        }).catch((e) => {
            console.log('Error when add student', e);
            UntilsFunction.showToastError('Đã có lỗi xảy ra!');
            setIsLoading(false);
        })
    }

    return (
        <div className="popup-add-student">
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
                            <div className="dialog-account--title">Thêm sinh viên</div>
                            <div className="dialog-account-content">
                                <div className="grid  grid-cols-2 mb-4 gap-8">
                                    <InputValid label="Mã sinh viên: " name='student_id'
                                        isValid={validDataForm.student_id} onChangeData={onChangeData}
                                        value={dataForm.student_id} alert="Vui lòng điền vào trường này"
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
                                <div className="address-option mb-4 grid grid-cols-3 gap-8">
                                    <div className="input-valid mt-2">
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
                                    <div className="input-valid mt-2">
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
                                                value={`${dataForm.faculty_id}`}
                                            >
                                                <MenuItem value={-1}>Chọn khoa</MenuItem>
                                                {listFaculty.map((item, index) => <MenuItem value={item.id} key={index}>{item.name}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="input-valid mt-2">
                                        <div className="input-valid__label flex">
                                            <label htmlFor=""> Chuyên ngành:  </label>
                                        </div>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                className="select-address"
                                                sx={{ width: '14.5rem' }}
                                                defaultValue={`${0}`}
                                                name='major_id'
                                                onChange={onChangeFormControl}
                                                value={`${listLocalMajor.find((item) => item.id === dataForm.major_id) ? dataForm.major_id : -1}`}
                                            >
                                                <MenuItem value={-1}>Chọn ngành</MenuItem>
                                                {listLocalMajor.map((item, index) => <MenuItem value={item.id} key={index}>{item.name}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                                <div className="grid  grid-cols-2 mb-4">
                                    <div className="input-valid mt-2">
                                        <div className="input-valid__label flex">
                                            <label htmlFor=""> Ngày sinh:  </label>
                                        </div>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker className="date-picker" format="DD/MM/YYYY" value={dayjs(dataForm.birthday)} onChange={() => setDataForm({ ...dataForm, birthday: dayjs(dataForm.birthday).format('YYYY-MM-DD') })} />
                                        </LocalizationProvider>
                                    </div>
                                    <InputValid label="Số điện thoại: " name='phone'
                                        isValid={validDataForm.phone} onChangeData={onChangeData}
                                        value={dataForm.phone} alert="Số điện thoại không hợp lệ"
                                        disabled={false} />
                                </div>
                                <div className="input-valid">
                                    <div className="input-valid__label flex">
                                        <label htmlFor=""> Địa chỉ:  </label>
                                    </div>
                                    <AddressSelect textAddress={"Hà Nội-Ba Vì-Ba Trại"} setAddress={setAddress} disabled={false} />
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
                                    <span>Thêm sinh viên</span>
                                </LoadingButton>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}