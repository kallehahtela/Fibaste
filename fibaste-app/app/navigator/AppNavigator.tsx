import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Product } from '@store/listings';
import Chats from '@views/Chats';
import Home from '@views/Home';
import ProductList from '@views/ProductList';
import SingleProduct from '@views/SingleProduct';

export type AppStackParamList = {
    Home: undefined;
    Chats: undefined;
    ProductList: { category: string };
    SingleProduct: { product?: Product, id?: string };
};

const Stack = createNativeStackNavigator<AppStackParamList>();


const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Chats" component={Chats} />
        <Stack.Screen name="ProductList" component={ProductList} />
        <Stack.Screen name="SingleProduct" component={SingleProduct} />
      </Stack.Navigator>
  );
};

export default AppNavigator;