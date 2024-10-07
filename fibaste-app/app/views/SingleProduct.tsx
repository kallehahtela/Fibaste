import { View, StyleSheet, Pressable, Text, Alert } from 'react-native';
import { FC, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileNavigatorParamList } from '@navigator/ProfileNavigator';
import AppHeader from '@components/AppHeader';
import BackButton from '@ui/BackButton';
import ProductDetail from '@components/ProductDetail';
import useAuth from 'app/hooks/useAuth';
import colors from '@utils/colors';
import OptionButton from '@ui/OptionButton';
import OptionModal from '@components/OptionModal';
import { Feather, AntDesign } from '@expo/vector-icons';
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from '@api/runAxiosAsync';
import { showMessage } from 'react-native-flash-message';
import LoadingSpinner from '@ui/LoadingSpinner';
import { useDispatch } from 'react-redux';
import { deleteItem } from '@store/listings';

type Props = NativeStackScreenProps<ProfileNavigatorParamList, 'SingleProduct'>

const SingleProduct: FC<Props> = ({ route, navigation }) => {
    const { authState } = useAuth();
    const { authClient } = useClient();
    const { product } = route.params;
    const [showMenu, setShowMenu] = useState(false);
    const [busy, setBusy] = useState(false);
    const dispatch = useDispatch();

    const menuOptions = [
        {
            name: "Edit",
            icon: <Feather name="edit" size={20} color={colors.primary} />,
          },
          {
            name: "Delete",
            icon: <Feather name="trash-2" size={20} color={colors.primary} />,
          },
    ];

    const isAdmin = authState.profile?.id === product?.seller.id;

    const confirmDelete = async () => {
        const id = product?.id;
        if (!id) return;

        setBusy(true);
        const res = await runAxiosAsync<{message: string}>(authClient.delete('/product/' + id));
        setBusy(false);
        if (res?.message) {
            dispatch(deleteItem(id))
            showMessage({message: res.message, type: 'success'});
            navigation.navigate('Listings');
        }
    };

    const onDeletePress = () => {
        Alert.alert(
            'Are you sure?', 
            'This action will remove this task permanently.', 
            [
                {text: 'Delete', style: 'destructive', onPress: confirmDelete}, 
                {text: 'Cancel', style: 'cancel'},
            ]
        );
    };

    return (
        <>
            <AppHeader 
                backButton={<BackButton />} 
                right={<OptionButton onPress={() => setShowMenu(true)} visible={isAdmin} />} 
            />

            <View style={styles.container}>
                {product ? <ProductDetail product={product} /> : <></>}

                <Pressable 
                    onPress={() => navigation.navigate('ChatWindow')}
                    style={styles.messageBtn}
                >
                    <AntDesign name='message1' size={20} color={colors.white}/>
                </Pressable>
            </View>

            <OptionModal 
                options={menuOptions} 
                renderItem={({icon, name}) => 
                <View style={styles.option}>
                    {icon}
                    <Text style={styles.optionTitle}>{name}</Text>
                </View> } 
                visible={showMenu} 
                onRequestClose={setShowMenu}
                onPress={(option) => {
                    if (option.name === 'Delete') {
                        onDeletePress()
                    }
                }}
            />
            <LoadingSpinner visible={busy} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    optionTitle: {
        paddingLeft: 5,
        color: colors.primary,
    },
    messageBtn: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: colors.active,
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
});

export default SingleProduct;