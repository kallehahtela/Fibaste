import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FC } from 'react';
import size from '@utils/size';
import { useNavigation } from '@react-navigation/native';

interface Props {
    backButton?: JSX.Element | null;
    center?: JSX.Element | null;
    right?: JSX.Element | null;
}

const AppHeader: FC<Props> = ({ backButton, center, right}) => {
    const { goBack, canGoBack } = useNavigation();

    return (
        <View style={styles.container}>
            {/* Back button */}
            {canGoBack() && <Pressable onPress={goBack}>
                {backButton}
            </Pressable>}
            {/* Center ui */}
            <Pressable>
                {center}
            </Pressable>
            {/* Right ui */}
            <Pressable>
                {right}
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: size.padding,
    },
});

export default AppHeader