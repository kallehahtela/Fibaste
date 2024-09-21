import FormInput from "@ui/FormInput";
import WelcomeHeader from "@ui/WelcomeHeader";
import { FC, useState } from "react";
import { StyleSheet, Text, View } from 'react-native';
import AppButton from "@ui/AppButton";
import FormDivider from "@ui/FormDivider";
import FormNavigator from "@ui/FormNavigator";
import SocialsLogin from "@ui/SocialsLogin";
import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import { signInSchema, yupValidate } from "@utils/validator";
import { showMessage } from "react-native-flash-message";

interface Props {}

const SignIn: FC<Props> = (props) => {
    const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
      });

    const handleSubmit = async () => {
    const { values, error } = await yupValidate(signInSchema, userInfo);

    if (error) return showMessage({ message: error, type: "danger" });
    if (values) SignIn(values);
    };

    const handleChange = (name: string) => (text: string) => {
    setUserInfo({ ...userInfo, [name]: text });
    };

    const { email, password } = userInfo;

    return (
       <CustomKeyAvoidingView>
            <View style={styles.innerContainer}>
                <WelcomeHeader />

                <View style={styles.formContainer}>

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

                    <AppButton title='Sign In' onPress={handleSubmit}/>

                    <FormDivider />

                    <FormNavigator
                        leftTitle="Forget Password"
                        onLeftPress={() => navigate('ForgetPassword')}
                        rightTitle="Sign Up"
                        onRightPress={() => navigate('SignUp')}
                    />

                    <FormDivider />
                    <Text style={styles.orText}>Or login with socials</Text>

                    <SocialsLogin />
                </View>
            </View>
       </CustomKeyAvoidingView>
    );
};

const styles = StyleSheet.create({
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

export default SignIn;