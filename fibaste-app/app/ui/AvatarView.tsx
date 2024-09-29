import { View, Text, StyleSheet, Image } from 'react-native';
import { FC } from 'react';
import { AntDesign } from '@expo/vector-icons';
import colors from '@utils/colors';

interface Props {
    uri?: string;
    size: number;
};

const iconContainerFactor = 0.7;
const iconSizeFactor = 0.7;

const AvatarView: FC<Props> = ({ uri, size = 50 }) => {
    const iconContainerSize = size * iconContainerFactor;
    const iconSize = size * iconSizeFactor;

    return (
    <View style={[
        {width: size, height: size, borderRadius: size / 2}, 
        styles.container,
        !uri && styles.profileIcon,
    ]}
    >
        {uri? <Image source={{uri}} style={styles.flex1}/> 
        : 
        <View style={[{ 
            width: iconContainerSize, 
            height: iconContainerSize, 
            borderRadius: iconContainerSize / 2
            }, styles.iconContainer]}
        >
            <AntDesign name='user' size={iconSize} color={colors.white} />    
        </View>}
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    flex1: {
        flex: 1,
    },
    profileIcon: {
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});

export default AvatarView