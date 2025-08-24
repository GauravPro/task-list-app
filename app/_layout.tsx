import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import Header from "@/components/Header";
import TabHeader from "@/components/TabHeader";

interface Task {
  id: string;
  title: string;
  context?: string;
  dueDate?: string;
  completed: boolean;
  overdue?: boolean;
}

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TaskItem = ({
  item,
  onComplete,
  onRemove,
}: {
  item: Task;
  onComplete: (id: string) => void;
  onRemove: (id: string) => void;
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (item.completed) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        // 👇 Remove after animation finishes
        onRemove(item.id);
      });
    }
  }, [item.completed]);

  return (
    <Animated.View style={[styles.taskCard, { opacity: fadeAnim }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.taskTitle}>{item.title}</Text>

        {/* Context */}
        {item.context ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign
              name="folderopen"
              size={14}
              color="gray"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.meta}>{item.context}</Text>
          </View>
        ) : null}

        {/* Due Date */}
        {item.dueDate ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign
              name="calendar"
              size={14}
              color={item.overdue ? "red" : "gray"}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.meta, item.overdue ? styles.overdue : null]}>
              {item.dueDate}
            </Text>
            {item.overdue && <Text style={styles.overdue}> Overdue</Text>}
          </View>
        ) : null}
      </View>

      {/* Complete Button */}
      <TouchableOpacity onPress={() => onComplete(item.id)}>
        {item.completed ? (
          <View style={styles.completedBox}>
            <AntDesign name="check" size={16} color="white" />
          </View>
        ) : (
          <View style={styles.incompleteBox} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [context, setContext] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [recentlyDeleted, setRecentlyDeleted] = useState<Task | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load tasks
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("TASKS");
      if (saved) setTasks(JSON.parse(saved));
    })();
  }, []);

  // Save tasks
  useEffect(() => {
    AsyncStorage.setItem("TASKS", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      context: context,
      dueDate: dueDate,
      completed: false,
      overdue: false,
    };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks([task, ...tasks]);
    setNewTask("");
    setContext("");
    setDueDate("");
    setInputVisible(false);
  };

  const completeTask = (id: string) => {
    const taskToRemove = tasks.find((t) => t.id === id);
    if (!taskToRemove) return;

    setTasks(
      tasks.map((item) =>
        item.id === id ? { ...item, completed: true } : item
      )
    );

    // Undo logic
    undoTimer.current = setTimeout(() => {
      setTasks((current) => current.filter((val) => val.id !== id));
      setRecentlyDeleted(null);
    }, 7000);

    setRecentlyDeleted(taskToRemove);
  };

  const undoDelete = () => {
    if (recentlyDeleted) {
      if (undoTimer.current) clearTimeout(undoTimer.current);
      setTasks((item) => [...item, recentlyDeleted]);
      setRecentlyDeleted(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subcontainer}>
        {/* Header */}
        <Header />
        {/* Tabs */}
        <TabHeader />
        {/* Task List */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              item={item}
              onComplete={completeTask}
              onRemove={(id) =>
                setTasks((prev) => prev.filter((t) => t.id !== id))
              }
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No tasks yet</Text>}
        />

        {/* Undo Snackbar */}
        {recentlyDeleted && (
          <View style={styles.undoBox}>
            <Text>Task completed</Text>
            <TouchableOpacity onPress={undoDelete}>
              <Text style={styles.undoText}>UNDO</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Input Modal */}
        {inputVisible && (
          <Animated.View style={styles.inputBox}>
            <TextInput
              placeholder="Task title"
              value={newTask}
              onChangeText={setNewTask}
              style={styles.input}
            />
            <TextInput
              placeholder="Context"
              value={context}
              onChangeText={setContext}
              style={styles.input}
            />
            <TextInput
              placeholder="Due date"
              value={dueDate}
              onChangeText={setDueDate}
              style={styles.input}
            />
            <TouchableOpacity onPress={addTask} style={styles.saveBtn}>
              <Text style={{ color: "white" }}>Save</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Add Task Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setInputVisible(!inputVisible)}
        >
          <AntDesign name="plus" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  subcontainer: { flex: 1, backgroundColor: "#fff", padding: 20 },
  empty: { textAlign: "center", marginTop: 20, color: "gray" },
  taskCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  taskTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  meta: { fontSize: 12, color: "gray" },
  overdue: { color: "red", fontSize: 12 },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
    marginLeft: 4,
  },
  completedBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  },
  incompleteBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#5bd165ff",
    backgroundColor: "#e8fbedff",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#09c284ff",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  inputBox: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 2,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 5,
  },
  saveBtn: {
    backgroundColor: "#09c284ff",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  undoBox: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  undoText: { color: "blue", fontWeight: "bold" },
});
