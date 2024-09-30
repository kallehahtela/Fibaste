import { View, Text } from 'react-native'
import React from 'react'
import AppHeader from '@components/AppHeader'
import BackButton from '@ui/BackButton'

const Chats = () => {
  return (
    <View>
      <AppHeader backButton={<BackButton />} />
    </View>
  )
}

export default Chats