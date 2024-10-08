import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { FC } from 'react';
import AppHeader from '@components/AppHeader';
import BackButton from '@ui/BackButton';
import size from '@utils/size';
import colors from '@utils/colors';
import HorizontalImageList from '@components/HorizontalImageList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileNavigatorParamList } from '@navigator/ProfileNavigator';
import { FontAwesome5 } from '@expo/vector-icons';
import FormInput from '@ui/FormInput';
import DatePicker from '@ui/DatePicker';
import OptionSelector from './OptionSelector';

type Props = NativeStackScreenProps<ProfileNavigatorParamList, 'EditProduct'>

const EditProduct: FC<Props> = ({ route }) => {
    const { product } = route.params;

    return (
        <>
            <AppHeader backButton={<BackButton />} />
            <View style={styles.container}>
                <ScrollView>
                    <Text style={styles.title}>Images</Text>
                    <HorizontalImageList images={product.image || []} />
                    <Pressable style={styles.imageSelector}>
                        <FontAwesome5 name='images' size={30} color={colors.primary} />
                    </Pressable>

                    <FormInput placeholder='Task name' value={product.name} />
                    <FormInput placeholder='Price' keyboardType='numeric' value={product.price.toString()} />

                    <DatePicker 
                        value={new Date(product.date)} 
                        title='Publishing Date' 
                        onChange={() => {}}
                    />

                    
                    <OptionSelector 
                        title={product.category || 'Category'}
                    />

                    <FormInput placeholder='Description' value={product.description} />

                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: size.padding,
    },
    title: {
        fontWeight: '600',
        fontSize: 16,
        color: colors.primary,
    },
    imageSelector: {
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 7,
        borderColor: colors.primary,
        marginVertical: 10,
    },
});

export default EditProduct