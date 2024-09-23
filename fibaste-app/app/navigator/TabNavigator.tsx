import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppNavigator from './AppNavigator';
import ProfileNavigator from './ProfileNavigator';
import { AntDesign } from '@expo/vector-icons';
import NewListing from '@views/NewListing';

const Tab = createBottomTabNavigator();

const getOptions = (iconName: string, title: string): BottomTabNavigationOptions => {
    return {
        tabBarIcon({ color, size}) {
            return <AntDesign name={iconName as any} size={size} color={color} />;
        },
        title: title,
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
                options={getOptions('search1', 'Explore')}
            />
           
        </Tab.Navigator>
    );
};

export default TabNavigator;