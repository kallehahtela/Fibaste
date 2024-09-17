import { Platform, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { FC, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const CustomKeyAvoidingView: FC<Props> = ({ children }) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={50}
        >
            <ScrollView>{children}</ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({

});

export default CustomKeyAvoidingView;