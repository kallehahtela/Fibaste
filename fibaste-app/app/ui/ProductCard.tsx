import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { FC } from 'react'
import { formatPrice } from '@utils/helper';
import colors from '@utils/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LatestProduct } from '@components/LatestProductList';

interface Props {
    product: LatestProduct;
    onPress(item: LatestProduct): void;
};

const ProductCard: FC<Props> = ({ product, onPress }) => {
    return (
        <Pressable 
            onPress={() => onPress(product)} 
            style={styles.productContainer}
        >
            {product.thumbnail ? (<Image source={{ uri: product.thumbnail}} style={styles.thumbnail} />
            ) : (
                <View style={[styles.thumbnail, styles.noImageView]}>
                    <MaterialCommunityIcons name='image-off' size={35} color={colors.primary} />
                </View>
            )}
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            <Text style={styles.name}>{product.name}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    thumbnail: {
        width: '100%',
        height: 100,
        borderRadius: 5,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.active,
        paddingTop: 5,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
    },
    productContainer: {
        padding: 7,
    },
    noImageView: {
        backgroundColor: colors.deActive,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ProductCard