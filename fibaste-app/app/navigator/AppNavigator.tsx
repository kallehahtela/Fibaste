import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '@views/Home';

export type AppStackParamList = {
    Home: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();


const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
  );
};

export default AppNavigator;