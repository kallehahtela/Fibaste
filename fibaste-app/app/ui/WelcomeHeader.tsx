import { FC } from 'react'
import { View, StyleSheet, Image } from 'react-native'

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
});

export default WelcomeHeader