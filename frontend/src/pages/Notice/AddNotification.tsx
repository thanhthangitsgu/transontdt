import { Button, Dialog, DialogContent, FormControl, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import UntilsFunction, { Transition } from "../../utils/UtilsFunction";
import { useEffect, useState } from "react";
import InputValid from "../../components/InputValid";
import AxiosClient from "../../api/AxiosClient";
import { LecturerType, MajorType, NoticeType } from "../../utils/DataType";
import useGet from "../../hook/useGet";
import ReactDOM from 'react-dom';
import { EditorProvider, FloatingMenu, BubbleMenu } from '@tiptap/react'
import 'draft-js/dist/Draft.css';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type Form = {
    title: string,
    content: string,
    created_by: string,
}

const initForm: Form = {
    title: '',
    content: '',
    created_by: '',
}

const initValid = {
    title: false,
    content: false,
    created_by: false,
}

type props = {
    add: Function,
    open: boolean,
    setOpen: Function
}
export default function AddNotification({ add, open, setOpen }: props) {
    const [dataForm, setDataForm] = useState<Form>(initForm);
    const [validForm, setValidForm] = useState<any>(initValid);
    const [listLocalMajor, setListLocalMajor] = useState<MajorType[]>([]);
    const dataMajor = useGet('majors', false);
    const profile = useSelector<RootState, LecturerType>(state => state.profile);

    useEffect(() => {
        setValidForm({
            title: dataForm.title.length > 0,
            content: dataForm.content.length > 0,
            created_by: true,
        })
    }, [dataForm]);

    useEffect(() => {
        if (!dataMajor.response) return;
        setListLocalMajor(dataMajor.response);
    }, [dataMajor.response]);

    useEffect(() => {
        setDataForm({ ...dataForm, created_by: profile.email })
    }, [profile])


    function onChangeData(name: string, value: string): void {
        setDataForm({ ...dataForm, [name]: value })
    }

    function onSubmit(): void {
        AxiosClient.post('notification', dataForm).then((data) => {
            let lec: NoticeType = data.data.data;
            add(lec);
            UntilsFunction.showToastSuccess('Thêm thông báo thành công!');
            setTimeout(() => {
                setOpen(false);
            }, 1000)

        }).catch((e) => {
            UntilsFunction.showToastError(`${e.message}`);
        })
    }

    function onChangeContent(): void {

    }

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
                <div className="dialog-account--title">Thêm thông báo</div>
                <div className="w-full mt-8">
                    <InputValid
                        label={"Tiêu đề"} name={"title"}
                        onChangeData={onChangeData} value={dataForm.title}
                        isValid={validForm.title} alert={"Không được để trống trường này"} disabled={false} />

                    <div className="mt-4">
                        <div className="input-valid__label flex">
                            <label>Nội dung</label>
                        </div>
                        <TextField
                            id="outlined-textarea"
                            placeholder="Nội dung"
                            multiline
                            fullWidth
                            value={dataForm.content}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setDataForm({ ...dataForm, content: event.target.value });
                            }}
                        />
                    </div>
                </div>
            </DialogContent>
            <div className="p-4 w-full flex justify-end">
                <Button variant="contained" onClick={onSubmit}> Thêm thông báo</Button>
            </div>
        </Dialog>
    )
}