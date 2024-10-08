import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppNavigator from './AppNavigator';
import ProfileNavigator from './ProfileNavigator';
import { AntDesign } from '@expo/vector-icons';
import NewListing from '@views/NewListing';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();

const getOptions = (iconName: string, title: string): BottomTabNavigationOptions => {
    return {
        tabBarIcon({ color, size}) {
            return <AntDesign name={iconName as any} size={size} color={color} />;
        },
        title: title,
        tabBarStyle: { 
            paddingBottom: Platform.OS === 'ios' ? 0 : 5,
            height: Platform.OS === 'ios' ? 50 : 65,
        },
    };
};

const TabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen 
                name='HomeNavigator' 
                component={AppNavigator} 
                options={getOptions('home', 'Home')}
            />
            <Tab.Screen 
                name='NewListing' 
                component={NewListing} 
                options={getOptions('pluscircleo', 'Add')}
            />
            <Tab.Screen 
                name='ProfileNavigator' 
                component={ProfileNavigator} 
                options={getOptions('user', 'Profile')}
            />
           
        </Tab.Navigator>
    );
};

export default TabNavigator;