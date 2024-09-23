import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FC, useState } from 'react';
import FormInput from '@ui/FormInput';
import { FontAwesome5 } from '@expo/vector-icons';
import colors from '@utils/colors';
import DatePicker from '@ui/DatePicker';
import OptionModal from '@components/OptionModal';
import categories from '@utils/categories';
import CategoryOption from '@ui/CategoryOption';

interface Props {}

const NewListing: FC<Props> = (props) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  return (
    <View style={styles.container}>
        <Pressable style={styles.fileSelector}>
            <View style={styles.iconContainer}>
                <FontAwesome5 name="images" size={24} color="black" />
            </View>
            <Text style={styles.btnTitle}>Add Images</Text>
        </Pressable>
      <FormInput placeholder='Task name'/>
      <FormInput placeholder='Price'/>
      <DatePicker 
        title='Publishing Date: ' 
        value={new Date()} 
        onChange={() => {}}
        />

      <Pressable onPress={() => setShowCategoryModal(true)}>
        <Text>Category</Text>
      </Pressable>
       
      <FormInput placeholder='Description'/>

      <OptionModal 
          visible={showCategoryModal} 
          onRequestClose={setShowCategoryModal}
          options={categories}
          renderItem={(item) => {
            return (
              <CategoryOption {...item} />
            );
          }}
          onPress={(item) => {
            console.log(item);
          }}
        />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    btnTitle: {
       color: colors.primary,
       marginTop: 5,
    },
    fileSelector: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        alignSelf: 'flex-start',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 70,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 7,
    },

});

export default NewListing