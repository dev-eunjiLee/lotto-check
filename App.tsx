import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles_layout.container}>
      <View style={styles_layout.header}>
        <Text style={styles_text.header_title}>오늘의 로또</Text>
      </View>
      <View style={styles_layout.body}>
        <Text style={styles_text.body_content}>오늘 구매한 로또 번호 등록</Text>
      </View>
    </View>
  );
}

const styles_layout = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fcba03',
    },
    header: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: {
      flex: 1,
      fontSize: 50,
      fontWeight:"bold",
      alignItems: 'center',
      alignContent: "center"
    }
});

const styles_text = StyleSheet.create({
  header_title: {
    fontSize: 50,
    fontWeight:"bold",
    alignContent: "center"
  },
  body_content: {
    fontSize: 20,
    alignContent: "center"
  }
});
