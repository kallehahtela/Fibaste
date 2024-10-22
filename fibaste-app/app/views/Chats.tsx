import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import AppHeader from '@components/AppHeader'
import BackButton from '@ui/BackButton'
import EmptyView from '@ui/EmptyView'
import useClient from 'app/hooks/useClient'
import { runAxiosAsync } from '@api/runAxiosAsync'
import { useDispatch, useSelector } from 'react-redux'
import { ActiveChat, getActiveChats, removeUnreadChatCount } from '@store/chats'
import RecentChat, { Separator } from '@components/RecentChat'
import size from '@utils/size'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { ProfileNavigatorParamList } from '@navigator/ProfileNavigator'

const Chats = () => {
  const { authClient } = useClient();
  const chats = useSelector(getActiveChats);
  const dispatch = useDispatch();
  const { navigate } = useNavigation<NavigationProp<ProfileNavigatorParamList>>();

  

  const onChatPress = async (chat: ActiveChat) => {
    // first we want to remove the unread chat counts
    dispatch(removeUnreadChatCount(chat.id));

    // third we want to navigate our users to chat screen
    navigate('ChatWindow', { conversationId: chat.id, peerProfile: chat.peerProfile });
  };

  if (!chats.length) {
    return (
      <>
        <AppHeader backButton={<BackButton />} />
        <EmptyView title='There is no chats.' />
      </>
    );
  }

  return (
    <>
      <AppHeader backButton={<BackButton />} />
      <FlatList 
        data={chats}
        contentContainerStyle={styles.container}
        renderItem={({item}) => (
          <Pressable onPress={() => onChatPress(item)}>
            <RecentChat 
              name={item.peerProfile.name} 
              avatar={item.peerProfile.avatar} 
              timestamp={item.timestamp}
              lastMessage={item.lastMessage}
              unreadMessageCount={item.unreadChatCounts}
            />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
  }
});

export default Chats