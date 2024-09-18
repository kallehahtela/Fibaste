import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '@utils/colors';
import ForgetPassword from '@views/ForgetPassword';
import SignIn from '@views/SignIn';
import SignUp from '@views/SignUp';
import Navigator from 'app/navigator';
import { Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';



export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'default'} />
      <Navigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
