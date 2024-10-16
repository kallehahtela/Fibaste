import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FC, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '@navigator/AppNavigator';
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from '@api/runAxiosAsync';
import { LatestProduct } from '@components/LatestProductList';
import ProductGridView from '@components/ProductGridView';
import colors from '@utils/colors';
import size from '@utils/size';
import AppHeader from '@components/AppHeader';
import BackButton from '@ui/BackButton';
import EmptyView from '@ui/EmptyView';
import ProductCard from '@ui/ProductCard';

type Props = NativeStackScreenProps<AppStackParamList, 'ProductList'>;

const col = 2;

const ProductList: FC<Props> = ({ route, navigation }) => {
    const [ products, setProducts ] = useState<LatestProduct[]>([]);
    const { authClient } = useClient();
    const { category } = route.params;

    const isOdd = products.length % col !== 0;

    const fetchProducts = async (category: string) => {
        const res = await runAxiosAsync<{products: LatestProduct[]}>(authClient.get('/product/by-category/'+ category));
        if (res) {
            setProducts(res.products);
        }
    };

    useEffect(() => {
        fetchProducts(category);
    }, [category]);

    if (!products.length) {
        return (
            <View style={styles.container}>
                <AppHeader 
                    backButton={<BackButton />} 
                    center={<Text style={styles.title}>{category}</Text>}
                />

                <EmptyView title='There are none tasks in this category' />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader 
                backButton={<BackButton />} 
                center={<Text style={styles.title}>{category}</Text>}
            />    

            <FlatList 
                numColumns={col}
                data={products}
                renderItem={({item, index}) => (
                    <View 
                        style={{ 
                            flex: isOdd && index === products.length - 1 ? 1 / col : 1,
                        }}>
                        <ProductCard
                            product={item}
                            onPress={({ id }) => navigation.navigate('SingleProduct', { id })}
                        />
                    </View>
                )}
            />        
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: size.padding,
    },
    title: {
        fontWeight: '600',
        color: colors.primary,
        paddingBottom: 5,
        fontSize: 18,
    },
});

export default ProductList;