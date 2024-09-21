import { FC } from 'react'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import colors from '@utils/colors';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { useSelector } from 'react-redux';
import { getAuthState } from 'app/store/auth';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
  },
};

interface Props {};

const Navigator: FC<Props> = (props) => {
  const authState = useSelector(getAuthState);

  console.log(authState);

  const loggedIn = false;

  return (
    <NavigationContainer theme={MyTheme}>
      {!loggedIn ? <AuthNavigator /> : <AppNavigator /> }
    </NavigationContainer>
  );
};

export default Navigator;