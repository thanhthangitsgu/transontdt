import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initValue: string = 'Trang Chủ';

export const TitleSlice = createSlice({
    name: 'title',
    initialState: initValue,
    reducers: {
        setTitle: (state, action: PayloadAction<string>) => action.payload
    }
});

export const { setTitle } = TitleSlice.actions;
export default TitleSlice.reducer;