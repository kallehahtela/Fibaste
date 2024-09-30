import { View, Text, FlatList } from 'react-native';
import { FC, useEffect, useState } from 'react';
import AppHeader from '@components/AppHeader'
import BackButton from '@ui/BackButton'
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from '@api/runAxiosAsync';

interface Props {}

type Product = {
  id: string;
  name: string;
  thumbnail?: string | undefined;
  category: string;
  price: number;
  image?: string[];
  date: Date;
  description: string;
  seller: {
      id: string;
      name: string;
      avatar?: string;
  };
}

type ListingResponse = {
  products: Product[]
};

const Listings = () => {
  const [listings, setListings] = useState<Product[]>([]);
  const { authClient } = useClient();

  const fetchListings = async () =>  {
    const res = await runAxiosAsync<ListingResponse>(authClient.get('/product/listings'));
    if (res) {
      setListings(res.products);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [])

  return (
    <View>
      <AppHeader backButton={<BackButton />} />

      <FlatList 
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => {
        return (
          <Text>
            {item.name}
          </Text>
        );
      }} />
    </View>
  );
};

export default Listings