import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { FC } from 'react';
import { AntDesign } from '@expo/vector-icons';
import colors from '@utils/colors';

interface Props {
  asButton?: boolean;
  onPress?(): void;
};

const SearchBar: FC<Props> = ({ asButton, onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <AntDesign name='search1' size={24} color={colors.primary} />

      {asButton ? ( 
        <View style={styles.textInput}>
          <Text style={styles.fakePlaceholder}>Explore here...</Text>
        </View> 
        ) : (
        <TextInput 
          placeholder='Explore here...' 
          style={[styles.textInput, styles.textInputFont]} 
          autoFocus
        />
        )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: colors.primary,
      padding: 10,
    },
    textInput: {
      paddingLeft: 10,
      paddingTop: 2,
      flex: 1,
    },
    textInputFont: {
      color: colors.primary,
      fontSize: 17,
    },
    fakePlaceholder: {
      color: colors.primary,
      fontSize: 17,
      opacity: 0.5,
      fontWeight: '200',
    },
});

export default SearchBar