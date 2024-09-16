import colors from '@utils/colors';
import { FC } from 'react'
import { View, StyleSheet, Image, Text } from 'react-native'

interface Props {}

const heading = "Your Gig Economy Marketplace";
const subHeading = "Post tasks, earn extra cash, and support charities with every transaction. Connecting you to trusted services and opportunities.";


const WelcomeHeader: FC<Props> = (props) => {
    return (
      <View style={styles.container}>
          <Image 
          source={require('../../assets/hero.png')} 
          style={styles.image} 
          resizeMode="contain"
          resizeMethod="resize" 
          />
          <Text style={styles.heading}>{heading}</Text>
          <Text style={styles.subHeading}>{subHeading}</Text>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    image: {
        width: 250,
        height: 250,
    },
    heading: {
      fontWeight: '600',
      fontSize: 20,
      textAlign: 'center',
      lineHeight: 20,
      color: colors.primary,
    },
    subHeading: {
      fontSize: 12,
      textAlign: 'center',
      letterSpacing: 1,
      marginBottom: 5,
      color: colors.primary,
    },
});

export default WelcomeHeader;