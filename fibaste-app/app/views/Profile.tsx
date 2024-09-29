import { View, Text,StyleSheet, ScrollView } from 'react-native';
import { FC } from 'react';
import AvatarView from '@ui/AvatarView';
import useAuth from 'app/hooks/useAuth';
import colors from '@utils/colors';
import size from '@utils/size';
import FormDivider from '@ui/FormDivider';
import ProfileOptionListItem from '@components/ProfileOptionListItem';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileNavigatorParamList } from '@navigator/ProfileNavigator';

interface Props {}

const Profile: FC<Props> = (props) => {
  const { navigate } = useNavigation<NavigationProp<ProfileNavigatorParamList>>();
  const { authState } = useAuth();
  const { profile } = authState;

  const onMessagePress = () => {
    navigate('Chats');
  };
  const onListingPress = () => {
    navigate('Listings');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile image and profile info */}
      <View style={styles.profileContainer}>
        <AvatarView uri={profile?.avatar} size={80} />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{profile?.name}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
        </View>
      </View>

      <FormDivider />

      {/* Options for profile */}
      <ProfileOptionListItem 
        style={styles.marginBottom} 
        antIconName='message1' title='Messages'
        onPress={onMessagePress}
      />
      <ProfileOptionListItem 
        style={styles.marginBottom} 
        antIconName='appstore-o' 
        title='Your Tasks'
        onPress={onListingPress}
      />
      <ProfileOptionListItem 
        antIconName='logout' 
        title='Log out'
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: size.padding,
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileInfo: {
      flex: 1,
      paddingLeft: size.padding,
    },
    name: {
      color: colors.primary,
      fontSize: 20,
      fontWeight: 'bold',
    },
    email: {
      color: colors.primary,
      paddingTop: 2,
    },
    marginBottom: {
      marginBottom: 15,
    }
});

export default Profile;