import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LecturerType } from "../../utils/DataType";

const initValue: LecturerType = {
    id: "",
    lecturer_id: "",
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    birthday: "",
    address: "",
    phone: "",
    faculty_id: 0,
    is_delete: 0,
    created_at: "",
    updated_at: ""
};

export const ProfileSlice = createSlice({
    name: 'profile',
    initialState: initValue,
    reducers: {
        setProfle: (state, action: PayloadAction<LecturerType>) => action.payload
    }
});

export const { setProfle } = ProfileSlice.actions;
export default ProfileSlice.reducer;