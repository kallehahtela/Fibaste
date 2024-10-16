import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { FC } from 'react';
import categories from '@utils/categories';
import colors from '@utils/colors';
import size from '@utils/size';

interface Props {
    onPress(category: string): void;
};

const LIST_ITEM_SIZE = 80

const CategoryList: FC<Props> = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        renderItem={({item}) => {
            return (
                <Pressable onPress={() => onPress(item.name)} style={styles.listItem}>
                    <View style={styles.iconContainer}>{item.icon}</View>
                    <Text 
                        numberOfLines={2} 
                        style={styles.categoryName}
                    >
                        {item.name}
                    </Text>
                </Pressable>
            );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: size.padding,
    },
    iconContainer: {
        width: LIST_ITEM_SIZE,
        height: LIST_ITEM_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 7,
        borderColor: colors.primary,
    },
    categoryName: {
       fontSize: 12,
       textAlign: 'center',
       paddingTop: 2,
       color: colors.primary,
    },
    listItem: {
       width: LIST_ITEM_SIZE,
       marginRight: size.padding,
    },
});

export default CategoryList