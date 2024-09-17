import { FC } from 'react';
import { View, StyleSheet, Pressable, Image,  } from 'react-native';

interface Props {}

const SocialsLogin: FC<Props> = (props) => {

    return (
        <View style={styles.container}>
            {/* Linkedin */}
            <Pressable>
                <Image 
                    source={require('../../assets/linkedin.png')}
                    style={styles.image}
                />
            </Pressable>

            {/* Google */}
            <Pressable>
                <Image 
                    source={require('../../assets/google.png')}
                    style={styles.image}
                />
            </Pressable>

            {/* Facebook */}
            <Pressable>
                <Image 
                    source={require('../../assets/facebook.png')}
                    style={styles.image}
                />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginHorizontal: 50,
    },
    image: {
        width: 40,
        height: 40,
    }
});

export default SocialsLogin;