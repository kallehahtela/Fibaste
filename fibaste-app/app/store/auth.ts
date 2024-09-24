import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { string } from "yup";

export type Profile = {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    avatar?: string;
    accessToken: string;
};

interface AuthState {
    profile: null | Profile;
    pending: boolean;
};

const initialState: AuthState = {
    pending: false,
    profile: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateAuthState(state, { payload }: PayloadAction<AuthState>) {
            state.pending = payload.pending;
            state.profile = payload.profile;
        },
    },
});

export const { updateAuthState } = authSlice.actions;
export const getAuthState = createSelector(
    (state: RootState) => state,
    (state) => state.auth,
);
export default authSlice.reducer;