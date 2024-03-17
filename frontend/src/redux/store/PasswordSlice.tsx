import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initValue: boolean = false;

export const PasswordSlice = createSlice({
    name: 'password',
    initialState: initValue,
    reducers: {
        setShowModal: (state, action: PayloadAction<boolean>) => action.payload
    }
});

export const { setShowModal } = PasswordSlice.actions;
export default PasswordSlice.reducer;