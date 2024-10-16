import { View, Text, StyleSheet } from 'react-native';
import { FC } from 'react';
import colors from '@utils/colors';

interface Props {
    title: string;
};

const EmptyView: FC<Props> = ({ title }) => {
    return (
        <View style={styles.container}>
            <Text numberOfLines={2} style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: colors.primary,
        opacity: 0.6,
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default EmptyView;