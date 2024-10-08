import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { FC } from 'react';
import { AntDesign } from '@expo/vector-icons';
import colors from '@utils/colors';

interface Props {
    antIconName: string;
    title: string;
    onPress?(): void;
    style?: StyleProp<ViewStyle>;
    active?: boolean;
};

const ProfileOptionListItem: FC<Props> = ({ antIconName, title, onPress, style, active }) => {
    return (
        <Pressable onPress={onPress} style={[styles.container, style]}>
            <View style={styles.buttonContainer}>
                <AntDesign 
                    name={antIconName as any} 
                    size={24} 
                    color={active ? colors.active : colors.primary}
                />
                <Text style={[styles.title, {color: active ? colors.active : colors.primary}]}>{title}</Text>
            </View>

            {active && <View style={styles.indicator} />}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        paddingLeft: 15,
    },
    indicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.active,
    },
});

export default ProfileOptionListItem