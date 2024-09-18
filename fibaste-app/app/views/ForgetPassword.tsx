import FormInput from "@ui/FormInput";
import WelcomeHeader from "@ui/WelcomeHeader";
import { FC } from "react";
import { StyleSheet, View } from 'react-native';
import AppButton from "@ui/AppButton";
import FormDivider from "@ui/FormDivider";
import FormNavigator from "@ui/FormNavigator";
import SocialsLogin from "@ui/SocialsLogin";
import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "app/navigator/AuthNavigator";

interface Props {}

const ForgetPassword: FC<Props> = (props) => {
    const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

    return (
       <CustomKeyAvoidingView>
            <View style={styles.innerContainer}>
                <WelcomeHeader />

                <View style={styles.formContainer}>
                    <FormInput 
                        placeholder='Email'
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />
                    
                    <AppButton title='Request Link'/>

                    <FormDivider />

                    <FormNavigator 
                        leftTitle='Sign Up'
                        onLeftPress={() => navigate('SignUp')}
                        rightTitle='Sign In'
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

export default ForgetPassword;