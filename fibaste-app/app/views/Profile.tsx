import { View, Text,StyleSheet } from 'react-native';
import { FC } from 'react';

interface Props {}

const Profile: FC<Props> = (props) => {
  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {},
});

export default Profile;