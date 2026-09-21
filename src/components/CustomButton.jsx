import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../Theme/Colors'; 

export default function CustomButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.primary, // Uses your red theme color
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  text: {
    color: Colors.light.background, // Uses white from your theme
    fontWeight: 'bold',
    fontSize: 16,
  },
});