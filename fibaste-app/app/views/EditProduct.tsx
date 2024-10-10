import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { FC, useState } from 'react';
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
import OptionModal from '@components/OptionModal';
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from '@api/runAxiosAsync';
import CategoryOptions from '@components/CategoryOptions';
import { selectImages } from '@utils/helper';
import AppButton from '@ui/AppButton';

type Props = NativeStackScreenProps<ProfileNavigatorParamList, 'EditProduct'>;

type ProductInfo = {
    name: string;
    description: string;
    category: string;
    price: string;
    publishingDate: Date;
};

const imageOptions = [
    { value: 'Use as Thumbnail', id: 'thumb' },
    { value: 'Remove Image', id: 'remove' },
];

const EditProduct: FC<Props> = ({ route }) => {
    const productInfoToUpdate = {
        ...route.params.product,
        price: route.params.product.price.toString(),
        date: new Date(route.params.product.date),
    };
    const [selectedImage , setSelectedImage] = useState('');
    const [showImageOptions , setShowImageOptions] = useState(false);
    const [busy, setBusy] = useState(false)
    const [product, setProduct] = useState({ ...productInfoToUpdate })
    const { authClient } = useClient();

    const onLongPress = (image: string) => {
        setSelectedImage(image);
        setShowImageOptions(true);
    };

    const removeSelectedImage = async () => {
        const notLocalImage = selectedImage.startsWith('https://res.cloudinary.com');

        const images = product.image;
        const newImages = images?.filter(img => img !== selectedImage);
        setProduct({ ...product, image: newImages });

        if (notLocalImage) {
            const splittedImage = selectedImage.split('/');
            const imageId = splittedImage[splittedImage.length - 1].split('.')[0];
            await runAxiosAsync(authClient.delete(`/product/image/${product.id}/${imageId}`));
        }
    };

    const handleOnImageSelect = async () => {
        const newImages = await selectImages();
        const oldImages = product.image || [];
        const images = oldImages.concat(newImages);
        setProduct({ ...product, image: [...images] });
    }

    const makeSelectedImageAsThumbnail = () => {
        if (selectedImage.startsWith('https://res.cloudinary.com')) {
            setProduct({ ...product, thumbnail: selectedImage });
        }
    };

    const handleOnSubmit = () => {

    }

    return (
        <>
            <AppHeader backButton={<BackButton />} />
            <View style={styles.container}>
                <ScrollView>
                    <Text style={styles.title}>Images</Text>
                    <HorizontalImageList images={product.image || []} onLongPress={onLongPress}/>
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

                    <CategoryOptions 
                        onSelect={(category) => setProduct({ ...product, category })}
                        title={product.category || 'Category'}
                    />

                    <FormInput placeholder='Description' value={product.description} />
                    <AppButton title='Update Task' onPress={handleOnSubmit} />
                </ScrollView>
            </View>

            <OptionModal 
                visible={showImageOptions}
                onRequestClose={setShowImageOptions}
                options={imageOptions}
                renderItem={(option) => {
                    return (
                        <Text style={styles.option}>{option.value}</Text>
                    );
                }}
                onPress={({id}) => {
                    if (id === 'thumb') {
                        makeSelectedImageAsThumbnail();
                    }

                    if (id === 'remove') {
                        removeSelectedImage();
                    }
                }}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: size.padding,
    },
    title: {
        fontWeight: "600",
        fontSize: 16,
        color: colors.primary,
        marginBottom: 10,
    },
    imageSelector: {
        height: 70,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 7,
        borderColor: colors.primary,
        marginVertical: 10,
    },
    option: {
        paddingVertical: 10,
        color: colors.primary,
    },
});

export default EditProduct