import { View, Text, StyleSheet, FlatList, ViewToken } from 'react-native';
import { FC, useRef, useState } from 'react';
import ProductImage from '@ui/ProductImage';
import colors from '@utils/colors';

interface Props {
    images?: string[];
};

const ImageSlider: FC<Props> = ({ images }) => {

    const [activeIndex, setActiveIndex] = useState(0);
    const viewableConfig = useRef({itemVisiblePercentThreshold: 50})

    const onViewableItemsChanged = useRef(((info: {
        viewableItems: ViewToken<string>[];
        changed: ViewToken<string>[];
    }) => {
        setActiveIndex(info.viewableItems[0].index || 0);
    }));

    if (!images?.length) return null;

    return (
        <View>
            <FlatList
                contentContainerStyle={styles.flatList} 
                data={images}
                renderItem={({item}) => <ProductImage uri={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                viewabilityConfig={viewableConfig.current}
                onViewableItemsChanged={onViewableItemsChanged.current}
            />

            <View style={styles.indicator}>
                <Text style={styles.title}>
                    {activeIndex +1 } / {images?.length}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {

    },
    flatList: {
        position: 'relative',
    },
    title: {
        color: colors.white,
        fontWeight: '600',
    },
    indicator: {
        position: 'absolute',
        width: 35,
        height: 25,
        backgroundColor: colors.backDropDark,
        bottom: 10,
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    }
});

export default ImageSlider