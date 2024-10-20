import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import AppHeader from '@components/AppHeader'
import BackButton from '@ui/BackButton'
import EmptyView from '@ui/EmptyView'
import useClient from 'app/hooks/useClient'
import { runAxiosAsync } from '@api/runAxiosAsync'

const Chats = () => {
  const { authClient } = useClient();
  const chats = [];

  const fetchLastChats = async () => {
    await runAxiosAsync(authClient('/conversation/last-chats'))
  };

  useEffect(() => {
    fetchLastChats();
  }, []);

  if (!chats.length) {
    return (
      <>
        <AppHeader backButton={<BackButton />} />
        <EmptyView title='There is no chats.' />
      </>
    );
  }

  return (
    <View>
      <AppHeader backButton={<BackButton />} />
    </View>
  )
}

export default Chats