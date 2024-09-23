import { View, Text, StyleSheet } from 'react-native';
import { FC } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '@utils/colors';

interface Props {
    title: string;
    value: Date;
    onChange(value: Date): void;
}

const DatePicker: FC<Props> = ({ title, value, onChange }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <DateTimePicker 
                testID='dateTimePicker' 
                    value={value} 
                    onChange={(_, date) => {
                        if (date) {
                            onChange(date);
                        }
                    }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
    },
    title: {
        color: colors.primary,
    },
});

export default DatePicker