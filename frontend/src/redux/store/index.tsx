import { configureStore } from "@reduxjs/toolkit";
import TitleSlice from "./TitleSlice";
import PasswordSlice from "./PasswordSlice";
import AuthSlice from "./AuthSlice";
import ProfileSlice from "./ProfileSlice";

export const store = configureStore({
    reducer: {
        title: TitleSlice,
        password: PasswordSlice,
        auth: AuthSlice,
        profile: ProfileSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

