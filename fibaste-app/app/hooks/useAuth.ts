import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuthState, updateAuthState } from "@store/auth";
import asyncStorage, { Keys } from "@utils/asyncStorage";
import client from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { useDispatch, useSelector } from "react-redux";

export interface SignInRes {
    profile: {
        id: string;
        email: string;
        name: string;
        verified: boolean;
        avatar?: string;
    };
    tokens: {
        refresh: string;
        access: string;
    };
};

type UserInfo = {
    email: string;
    password: string;
};

const useAuth = () => {
    const authState = useSelector(getAuthState);
    const dispatch = useDispatch()

    const signIn = async (userInfo: UserInfo) => {
        dispatch(updateAuthState({ profile: null, pending: true }));
        const res = await runAxiosAsync<SignInRes>(
            client.post('/auth/sign-in', userInfo)
        );

        if (res) {
            // store the tokens
            await asyncStorage.save(Keys.AUTH_TOKEN, res.tokens.access);
            await asyncStorage.save(Keys.REFRESH_TOKEN, res.tokens.refresh);
            dispatch(
                updateAuthState({
                    profile: { ...res.profile, accessToken: res.tokens.access },
                    pending: false,
                })
            );
        } else {
            dispatch(updateAuthState({ profile: null, pending: false }));
        }
    };

    const loggedIn = authState.profile ? true : false;

    return { signIn, authState, loggedIn }
};

export default useAuth;