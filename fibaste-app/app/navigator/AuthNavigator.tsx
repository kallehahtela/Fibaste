import { StyleSheet } from 'react-native';
import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '@views/SignIn';
import SignUp from '@views/SignUp';
import ForgetPassword from '@views/ForgetPassword';

export type AuthStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    ForgetPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();


const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='SignIn' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      </Stack.Navigator>
  );
};

export default AuthNavigator;