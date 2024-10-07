import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { FC, useEffect, useState } from 'react';
import AppHeader from '@components/AppHeader'
import BackButton from '@ui/BackButton'
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from '@api/runAxiosAsync';
import size from '@utils/size';
import ProductImage from '@ui/ProductImage';
import { getListings, Product, updateListings } from '@store/listings';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileNavigatorParamList } from '@navigator/ProfileNavigator';
import { useDispatch, useSelector } from 'react-redux';

interface Props {}

type ListingResponse = {
  products: Product[]
};

const Listings: FC<Props> = (props) => {
  const { navigate } = useNavigation<NavigationProp<ProfileNavigatorParamList>>();
  //const [listings, setListings] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(false);
  const { authClient } = useClient();
  const dispatch = useDispatch();
  const listings = useSelector(getListings);

  const fetchListings = async () =>  {
    setFetching(true);
    const res = await runAxiosAsync<ListingResponse>(authClient.get('/product/listings'));
    setFetching(false);
    if (res) {
      dispatch(updateListings(res.products));
    }
  };

  useEffect(() => {
    fetchListings();
  }, [])

  return (
    <>
    <AppHeader backButton={<BackButton />} />
      <View style={styles.container}>
        <FlatList
          refreshing={fetching}
          onRefresh={fetchListings}
          contentContainerStyle={styles.flatList}
          data={listings}
          keyExtractor={( item ) => item.id}
          renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() => navigate('SingleProduct', {product: item})}
              style={styles.listItem}
            >
              <ProductImage uri={item.thumbnail} />
              <Text 
                style={styles.productName}
                numberOfLines={2}
              >
                {item.name}
              </Text>
            </Pressable>
          );
        }} 
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: size.padding,
  },
  listItem: {
    paddingBottom: size.padding,
  },
  productName: {
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: 1,
    paddingTop: 10,
  },
  flatList: {
    paddingBottom: size.padding,
  }
});

export default Listings