import { View, StyleSheet } from 'react-native';
import { FC } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileNavigatorParamList } from '@navigator/ProfileNavigator';
import AppHeader from '@components/AppHeader';
import BackButton from '@ui/BackButton';
import ProductDetail from '@components/ProductDetail';

export type Product = {
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
};

type Props = NativeStackScreenProps<ProfileNavigatorParamList, 'SingleProduct'>

const SingleProduct: FC<Props> = ({ route }) => {
    const { product } = route.params;
    return (
        <>
            <AppHeader backButton={<BackButton />} />
            <View style={styles.container}>
                <ProductDetail />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {

    },
});

export default SingleProduct;