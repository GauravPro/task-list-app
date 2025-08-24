import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Header() {
  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>My Work</Text>
      </View>
      <Text style={styles.subHeader}>Good morning, Louis!</Text>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: { fontSize: 18, fontWeight: "bold" },
  subHeader: { fontSize: 16, marginVertical: 10 },
});
