import { FC } from "react";
import {StyleSheet, Image, SafeAreaView, Platform, StatusBar} from 'react-native';

interface Props {}

const SignIn: FC<Props> = (props) => {
    return (
        <SafeAreaView style={styles.container}>
           <Image 
            source={require('../../assets/hero.png')} 
            style={styles.image} 
            resizeMode="contain"
            resizeMethod="resize" 
           />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    image: {
        width: 250,
        height: 250,
    }
});

export default SignIn;