import { StyleSheet } from 'react-native';
import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '@views/SignIn';
import SignUp from '@views/SignUp';
import ForgetPassword from '@views/ForgetPassword';
import Home from '@views/Home';

export type AuthStackParamList = {
    Home: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();


const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
  );
};

export default AppNavigator;