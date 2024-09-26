import { FlatList, StyleSheet, Image, Pressable, StyleProp, ViewStyle } from 'react-native'
import { FC } from 'react';

interface Props {
    images: string[];
    onPress?(item: string): void;
    onLongPress?(item: string): void;
    style?: StyleProp<ViewStyle>;
}

const HorizontalImageList: FC<Props> = ({ images, onPress, onLongPress, style}) => {
    return (
    <FlatList 
        data={images}
        renderItem={({ item }) => {
            return (
                <Pressable 
                    onPress={() => onPress && onPress(item)} 
                    onLongPress={() => onLongPress && onLongPress(item)}
                    style={styles.listItem}>
                    <Image style={styles.image} source={{uri: item}} />
                </Pressable>
            );
        }}
        contentContainerStyle={style}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
    />
    );
};

const styles = StyleSheet.create({
    image: {
        flex: 1,
    },
    listItem: {
        width: 70,
        height: 70,
        borderRadius: 7,
        marginLeft: 5,
        overflow: 'hidden',
    },
});

export default HorizontalImageList