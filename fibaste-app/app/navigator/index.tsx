import { FC } from 'react'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import colors from '@utils/colors';
import AuthNavigator from './AuthNavigator';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
  },
};

const Navigator = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <AuthNavigator /> 
    </NavigationContainer>
  );
};

export default Navigator;