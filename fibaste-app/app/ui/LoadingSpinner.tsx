import { View, Text, StyleSheet, Modal } from 'react-native';
import { FC } from 'react';
import colors from '@utils/colors';
import Lottie from 'lottie-react-native'
import LottieView from 'lottie-react-native';

interface Props {
    visible: boolean;
}

const LoadingSpinner: FC<Props> = ({ visible }) => {
    if (!visible) return null;

    return (
        <Modal animationType='fade' transparent>
            <View style={styles.container}>
                <LottieView
                    source={require('../../assets/LoadingSpinner.json')}
                    autoPlay
                    loop
                    style={{ flex: 1, transform: [{ scale: .8 }] }}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backDrop,
    },
});

export default LoadingSpinner