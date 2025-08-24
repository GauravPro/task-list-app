import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TabHeader() {
  return (
    <>
      <View style={styles.tabs}>
        {["Tasks", "Reminders", "Meetings", "Notes"].map((tab, i) => (
          <Text
            key={i}
            style={[styles.tab, tab === "Tasks" && styles.activeTab]}
          >
            {tab}
          </Text>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: "row", marginBottom: 15 },
  tab: { marginRight: 20, fontSize: 14, color: "gray" },
  activeTab: { color: "blue", borderBottomWidth: 2, borderColor: "blue" },
});
