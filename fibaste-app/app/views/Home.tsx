import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FC, useEffect, useState } from 'react';
import ChatNotification from '@ui/ChatNotification';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '@navigator/AppNavigator';
import SearchBar from '@components/SearchBar';
import size from '@utils/size';
import CategoryList from '@components/CategoryList';
import LatestProductList, { LatestProduct } from '@components/LatestProductList';
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from '@api/runAxiosAsync';
import socket, { handleSocketConnection } from 'app/socket';
import useAuth from 'app/hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { ActiveChat, addNewActiveChats, getUnreadChatsCount } from '@store/chats';

interface Props {}

const Home = () => {
  const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const { authClient } = useClient();
  const { authState } = useAuth();
  const dispatch = useDispatch();
  const totalUnreadMessages = useSelector(getUnreadChatsCount);

  const fetchLastChats = async () => {
    const res = await runAxiosAsync<{
      chats: ActiveChat[]
  }>(authClient('/conversation/last-chats'));

  if (res) {
    dispatch(addNewActiveChats(res.chats));
  }
  };

  const fetchLatestProduct = async () => {
    const res = await runAxiosAsync<{ products: LatestProduct[] }>(
      authClient.get("/product/latest")
    );
    if (res?.products) {
      setProducts(res.products);
    }
  };

  useEffect(() => {

    const handleApiRequest = async () => {
      await fetchLatestProduct();
      await fetchLastChats();
    }

    handleApiRequest();
  }, []);

  useEffect(() => {
    if (authState.profile) {
      handleSocketConnection(authState.profile, dispatch);
    }
    return () => {
      socket.disconnect();
    }
  }, []);

  return (
    <>
      <ChatNotification 
        onPress={() => navigate('Chats')} 
        indicate={totalUnreadMessages > 0}
      />
      <ScrollView style={styles.container}>
        <SearchBar />
        <CategoryList 
          onPress={(category) => navigate('ProductList', {category})} 
        />
        <LatestProductList 
          data={products} 
          onPress={({id}) => navigate('SingleProduct', {id})} 
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: size.padding,
      flex: 1,
    },
});

export default Home;