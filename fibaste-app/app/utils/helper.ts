import * as ImagePicker from 'expo-image-picker';
import { showMessage } from 'react-native-flash-message';

export const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fi-FI', {
        style: 'currency',
        currency: 'EUR',
    }).format(amount)
};

export const selectImages = async () => {
    let result: string[] = [];
    try {
        const { assets } = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.3,
            allowsMultipleSelection: true,
        });

        if (assets) {
            result = assets.map(({ uri }) => uri);
        }
    } catch (error) {
        showMessage({ message: (error as any).message, type: "danger" });
    }

    return result;
};