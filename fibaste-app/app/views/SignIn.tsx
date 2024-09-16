import colors from "@utils/colors";
import FormInput from "@ui/FormInput";
import WelcomeHeader from "@ui/WelcomeHeader";
import { FC } from "react";
import {Button, StyleSheet, View } from 'react-native';
import AppButton from "@ui/AppButton";

interface Props {}

const SignIn: FC<Props> = (props) => {
    return (
        <View style={styles.container}>
            <WelcomeHeader />

            <View style={styles.formContainer}>
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
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    
    formContainer: {
        marginTop: 30,
    }
});

export default SignIn;