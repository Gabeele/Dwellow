import { StyleSheet, Text, View } from "react-native";
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Temp Page - Navigation</Text>
        <Text style={styles.links}><Link href="/login">Login</Link></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  links: {
    fontSize: 24,
    color: "rgba(54, 129, 86, 1)",
    textDecorationLine: "underline",
  }
});
