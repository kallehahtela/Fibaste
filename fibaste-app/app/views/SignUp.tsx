import colors from "@utils/colors";
import FormInput from "@ui/FormInput";
import WelcomeHeader from "@ui/WelcomeHeader";
import { FC } from "react";
import { StyleSheet, Text, View } from 'react-native';
import AppButton from "@ui/AppButton";
import FormDivider from "@ui/FormDivider";
import FormNavigator from "@ui/FormNavigator";
import SocialsLogin from "@ui/SocialsLogin";
import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";

interface Props {}

const SignUp: FC<Props> = (props) => {
    return (
        <CustomKeyAvoidingView>
            <View style={styles.innerContainer}>
                    <WelcomeHeader />

                    <View style={styles.formContainer}>

                        <FormInput 
                            placeholder='Name'
                        />

                        <FormInput 
                            placeholder='Email' 
                            keyboardType='email-address' 
                            autoCapitalize='none'
                        />
                    
                        <FormInput 
                            placeholder='Password'
                            secureTextEntry
                        />  

                        <AppButton title='Sign in'/>

                        <FormDivider />

                        <FormNavigator
                            leftTitle="Forget Password"
                            rightTitle="Sign Up"
                        />

                        <FormDivider />
                        <Text style={styles.orText}>Or signup with socials</Text>

                        <SocialsLogin />
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