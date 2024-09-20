import colors from "@utils/colors";
import FormInput from "@ui/FormInput";
import WelcomeHeader from "@ui/WelcomeHeader";
import { FC, useState } from "react";
import { StyleSheet, View } from 'react-native';
import AppButton from "@ui/AppButton";
import FormDivider from "@ui/FormDivider";
import FormNavigator from "@ui/FormNavigator";
import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import axios from 'axios';
import { newUserSchema, yupValidate } from "@utils/validator";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { showMessage } from "react-native-flash-message";

interface Props {}

const SignUp: FC<Props> = (props) => {
    const [userInfo, setUserInfo] = useState({name: '', email: '', password: ''});
    const [busy, setBusy] = useState(false);
    const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

    const handleChange = (name: string) => {
        return (text: string) => {
            setUserInfo({...userInfo, [name]: text});
        }
    };

    const handleSubmit = async () => {
        const { values, error } = await yupValidate(newUserSchema, userInfo);
        
        if (error) {
            return showMessage({ message: error, type: 'danger' });
        }
        
        setBusy(true);
        const res = await runAxiosAsync<{message: string}>(
            axios.post('http://localhost:8000/auth/sign-up', values)
        );

        if (res?.message) {
            showMessage({ message: res.message, type: 'success' });
        }
        setBusy(false);
    };

    const { name, email, password } = userInfo;

    return (
        <CustomKeyAvoidingView>
            <View style={styles.innerContainer}>
                <WelcomeHeader />

                <View style={styles.formContainer}>

                    <FormInput 
                        placeholder='Name'
                        value={name}
                        onChangeText={handleChange('name')}
                    />

                    <FormInput 
                        placeholder='Email' 
                        keyboardType='email-address' 
                        autoCapitalize='none'
                        value={email}
                        onChangeText={handleChange('email')}
                    />
                
                    <FormInput 
                        placeholder='Password'
                        secureTextEntry
                        value={password}
                        onChangeText={handleChange('password')}
                    />  

                    <AppButton active={!busy} title='Sign Up' onPress={handleSubmit}/>

                    <FormDivider />

                    <FormNavigator
                        leftTitle="Forget Password"
                        onLeftPress={() => navigate('ForgetPassword')}
                        rightTitle="Sign In"
                        onRightPress={() => navigate('SignIn')}

                    />
                </View>
                </View>
        </CustomKeyAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        padding: 15,
        flex: 1,
    },
    
    formContainer: {
        marginTop: 30,
    },
    orText: {
        textAlign: 'center',
        paddingBottom: 7,
    }
});

export default SignUp;