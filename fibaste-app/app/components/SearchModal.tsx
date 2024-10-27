import { View, Text, Modal, Pressable, StyleSheet, SafeAreaView, Platform, StatusBar, FlatList, Keyboard } from 'react-native';
import { FC, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import colors from '@utils/colors';
import SearchBar from './SearchBar';
import size from '@utils/size';
import EmptyView from '@ui/EmptyView';
import LottieView from 'lottie-react-native';

interface Props {
    visible: boolean;
    onClose(visible: boolean): void;
};

const searchResults = [
    { id: 1, name: 'Windows cleaning' },
    { id: 2, name: 'Carpet vacuuming' },
    { id: 3, name: 'Lawn mowing' },
    { id: 4, name: 'Dishwashing' },
    { id: 5, name: 'Grocery shopping' },
    { id: 6, name: 'Bathroom cleaning' },
    { id: 7, name: 'Laundry washing' },
    { id: 8, name: 'Dog walking' },
    { id: 9, name: 'Trash removal' },
    { id: 10, name: 'Furniture assembly' },
];

const SearchModal: FC<Props> = ({ visible, onClose }) => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [busy, setBusy] = useState(false);

    const handleClose = () => {
        onClose(!visible);
    };
    
    useEffect(() => {
        const keyShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
        const keyHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

        const keyShowListener = Keyboard.addListener(keyShowEvent, (evt) => {
            setKeyboardHeight(evt.endCoordinates.height + 50);
        });

        const keyHideListener = Keyboard.addListener(keyHideEvent, (evt) => {
            setKeyboardHeight(0);
        });

        return () => {
            keyShowListener.remove();
            keyHideListener.remove();
        };
    }, []);

    return (
        <Modal animationType='fade' onRequestClose={handleClose} visible={visible}>
            <SafeAreaView style={styles.container}>
                <View style={styles.innerContainer}>

                    {/* Search Bar */}
                    <View style={styles.header}>
                        <Pressable onPress={handleClose}>
                            <Ionicons name='arrow-back-outline' size={24} color={colors.primary} />
                        </Pressable>

                        <View style={styles.searchBar}>
                            <SearchBar  />
                        </View>
                    </View>

                    {/* Busy indicator */}
                    {busy ? (<View style={styles.busyIconContainer}>
                        <View style={styles.busyAnimationSize}>
                            <LottieView 
                                style={styles.flex1}
                                autoPlay
                                loop
                                source={require('../../assets/loading_2.json')}
                            />
                        </View>
                    </View>
                ) : null}

                    {/* Suggestions */}
                    <View style={{ paddingBottom: keyboardHeight }}>
                        <FlatList 
                            data={searchResults} 
                            renderItem={({ item }) => 
                            <Pressable>
                                <Text style={styles.suggestionListItem}>{item.name}</Text>
                            </Pressable>}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={styles.suggestionList}
                            ListEmptyComponent={<EmptyView title='No results found...' />}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    searchBar: {
        flex: 1,
        marginLeft: size.padding,
    },
    innerContainer: {
        padding: size.padding,
        flex: 1,
    },
    suggestionList: {
        padding: size.padding,
    },
    suggestionListItem: {
        color: colors.primary,
        fontWeight: '600',
        paddingVertical: 7,
        fontSize: 17,
    },
    busyIconContainer: {
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
    },
    flex1: {
        flex: 1,
    },
    busyAnimationSize: {
        height: 100,
        width: 100,
    },
});

export default SearchModal