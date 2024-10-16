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

const testData = [
  {
    id: "65943153939eb031a99e71e0",
    name: "E-book Reader",
    thumbnail:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2899&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Home Repairs",
    price: 129.99,
  },
  {
    id: "65943153939eb031a99e71df",
    name: "Cleaning Services",
    thumbnail:
      "",
    category: "Electronics",
    price: 49.99,
  },
  {
    id: "65943153939eb031a99e71de",
    name: "Wireless Mouse",
    thumbnail:
      "",
    category: "Delivery & Errands",
    price: 29.99,
  },
  {
    id: "65943153939eb031a99e71dd",
    name: "Digital Camera",
    thumbnail:
      "https://images.unsplash.com/photo-1556306535-38febf6782e7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Pet Care",
    price: 349.99,
  },
  {
    id: "65943153939eb031a99e71e2",
    name: "Laptop",
    thumbnail:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Tutoring & Lessons",
    price: 999.99,
  },
]

interface Props {}

const Home = () => {
  const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const { authClient } = useClient();

  const fetchLatestProduct = async () => {
    const res = await runAxiosAsync<{ products: LatestProduct[] }>(
      authClient.get("/product/latest")
    );
    if (res?.products) {
      setProducts(res.products);
    }
  };

  useEffect(() => {
    fetchLatestProduct();
  }, []);

  return (
    <>
      <ChatNotification onPress={() => navigate('Chats')} />
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