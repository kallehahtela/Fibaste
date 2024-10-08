import { View, Text, StyleSheet } from 'react-native';
import { FC } from 'react';
import AppHeader from '@components/AppHeader';
import BackButton from '@ui/BackButton';

interface Props {}

const ChatWindow: FC<Props> = (props) => {
    return (
        <View style={styles.container}>
            <AppHeader backButton={<BackButton />} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {

    },
});

export default ChatWindow