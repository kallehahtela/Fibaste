import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FC } from 'react';
import AvatarView from '@ui/AvatarView';
import colors from '@utils/colors';
import size from '@utils/size';
import { formatDate } from '@utils/date';

interface Props {
    avatar?: string;
    name: string;
    timestamp: string;
    lastMessage: string;
    unreadMessageCount: number;
};

const { width } = Dimensions.get('window');

const profileImageSize = 50;
const itemWidth = width - size.padding * 2;
const separatorWidth = width - profileImageSize * size.padding * 3;

const RecentChat: FC<Props> = ({ avatar, name, timestamp, lastMessage, unreadMessageCount }) => {
    const showNotification = unreadMessageCount > 0;

    return (
        <View style={styles.container}>
            <AvatarView uri={avatar} size={profileImageSize} />
            <View style={styles.chatInfo}>
                <View style={styles.flexJustifyBetween}>
                    <View style={styles.flex1}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.name}>{name}</Text>
                    </View>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={showNotification ? styles.activeText : styles.inActiveText}>{formatDate(timestamp)}</Text> 
                </View>

                <View style={styles.flexJustifyBetween}>
                    <View style={styles.flex1}>
                        <Text numberOfLines={2} ellipsizeMode='tail' style={styles.commonText}>{lastMessage}</Text>
                    </View>
                    
                    {showNotification ? (
                        <View style={styles.msgIndicator}>
                            <Text style={styles.msgIndicatorCount}>{unreadMessageCount}</Text>
                        </View>
                    ) : null }
                </View>
            </View>
        </View>
    );
};

export const Separator = () => <View style={styles.separator} />

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: itemWidth,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colors.primary,
        marginRight: size.padding,
    },
    commonText: {
        fontSize: 12,
        color: colors.primary,
    },
    chatInfo: {
        width: itemWidth - profileImageSize,
        paddingLeft: size.padding,
    },
    flexJustifyBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    flex1: {
        flex: 1,
    },
    msgIndicatorCount: {
        fontSize: 12,
        color: colors.white,
    },
    msgIndicator: {
        fontSize: 12,
        color: colors.white,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: colors.active,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inActiveText: {
        fontSize: 12,
        color: colors.primary,
    },
    activeText: {
        fontSize: 12,
        color: colors.active,
    },
    separator: {
        width: '50%', 
        backgroundColor: colors.deActive, 
        height: 1,
        alignSelf: 'flex-end',
        marginVertical: 15,
    },
});

export default RecentChat;