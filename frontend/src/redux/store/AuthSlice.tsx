import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initValue: number = -1;

export const AuthSlice = createSlice({
    name: 'auth',
    initialState: initValue,
    reducers: {
        setAuth: (state, action: PayloadAction<number>) => action.payload
    }
});

export const { setAuth } = AuthSlice.actions;
export default AuthSlice.reducer;