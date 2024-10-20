import { View, Text, StyleSheet } from 'react-native';
import { FC, useEffect } from 'react';
import AppHeader from '@components/AppHeader';
import BackButton from '@ui/BackButton';
import { AppStackParamList } from '@navigator/AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PeerProfile from '@ui/PeerProfile';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import useAuth from 'app/hooks/useAuth';
import EmptyChatContainer from '@ui/EmptyChatContainer';
import socket from 'app/socket';
import { useDispatch, useSelector } from 'react-redux';
import { addConversation, Conversation, selectConversationById, updateConversation } from '@store/conversation';
import { runAxiosAsync } from '@api/runAxiosAsync';
import useClient from 'app/hooks/useClient';

type Props = NativeStackScreenProps<AppStackParamList, 'ChatWindow'>;

type OutGoingMessage = {
    message: {
        id: string;
        time: string;
        text: string;
        user: {
            id: string;
            name: string;
            avatar?: string;
        }
    },
    to: string;
    conversationId: string;
};

const getTime = (value: IMessage['createdAt']) => {
    if (value instanceof Date) return value.toISOString();
    return new Date(value).toISOString();
};

const formatConversationToImessage = (value?: Conversation): IMessage[] => {
    const formattedValues = value?.chats.map(chat => {
        return {
            _id: chat.id,
            text: chat.text,
            createdAt: new Date(chat.time),
            user: {
                _id: chat.user.id,
                name: chat.user.name,
                avatar: chat.user.avatar,
            },
        };
    });

    const messages = formattedValues || [];

    return messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

const ChatWindow: FC<Props> = ({ route }) => {
    const { authState } = useAuth();
    const { conversationId, peerProfile } = route.params;
    const chats = useSelector(selectConversationById(conversationId));
    const dispatch = useDispatch();
    const { authClient } = useClient();

    const profile = authState.profile;

    const handleOnMessageSend = (messages: IMessage[]) => {
        if (!profile) return;

        const currentMessage = messages[messages.length - 1];

        const newMessage: OutGoingMessage = {
            message: {
                id: currentMessage._id.toString(),
                text: currentMessage.text,
                time: getTime(currentMessage.createdAt),
                user: { id: profile?.id, name: profile.name, avatar: profile.avatar },
            },
            conversationId,
            to: peerProfile.id,
        };

        // this will update our store and also the UI
        dispatch(
            updateConversation({
                conversationId, 
                chat: newMessage.message, 
                peerProfile,
            })
        );

        // sending message to our api
        socket.emit('chat:new', newMessage);
    };

    const fetchOldChats = async () => {
        const res = await runAxiosAsync<{conversation: Conversation}>(authClient('/conversation/chats/'+ conversationId));

        if (res?.conversation) {
            dispatch(addConversation([res.conversation]))
        } 
    };

    useEffect(() => {
        fetchOldChats();
    }, []);

    if (!profile) return null;

    return (
        <View style={styles.container}>
            <AppHeader 
                backButton={<BackButton />} 
                center={
                    <PeerProfile name={peerProfile.name} avatar={peerProfile.avatar} />
                } 
            />

            <GiftedChat 
                messages={formatConversationToImessage(chats)}
                user={{
                    _id: profile.id,
                    name: profile.name,
                    avatar: profile.avatar
                }}
                onSend={handleOnMessageSend}
                renderChatEmpty={() => <EmptyChatContainer />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ChatWindow