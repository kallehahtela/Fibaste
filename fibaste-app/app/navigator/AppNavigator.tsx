import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Product } from '@store/listings';
import Chats from '@views/Chats';
import ChatWindow from '@views/ChatWindow';
import Home from '@views/Home';
import ProductList from '@views/ProductList';
import SingleProduct from '@views/SingleProduct';

export type AppStackParamList = {
    Home: undefined;
    Chats: undefined;
    ProductList: { category: string };
    SingleProduct: { product?: Product, id?: string };
    ChatWindow: { 
      conversationId: string;
      peerProfile: { id: string, name: string, avatar?: string };
    };
};

const Stack = createNativeStackNavigator<AppStackParamList>();


const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Chats" component={Chats} />
        <Stack.Screen name="ProductList" component={ProductList} />
        <Stack.Screen name="SingleProduct" component={SingleProduct} />
        <Stack.Screen name="ChatWindow" component={ChatWindow} />
      </Stack.Navigator>
  );
};

export default AppNavigator;