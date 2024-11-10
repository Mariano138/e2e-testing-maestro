import { StatusBar } from "expo-status-bar";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [taskText, setTaskText] = useState("");
  const [taskArray, setTaskArray] = useState([]);

  useEffect(() => {
    const loadTask = async () => {
      const getTasks = await AsyncStorage.getItem("storedTasks");
      const jsonValue = JSON.parse(getTasks);
      if (jsonValue) {
        setTaskArray(jsonValue);
      }
    };
    loadTask();
  }, []);

  useEffect(() => {
    const loadTheme = async () => {
      const getTheme = await AsyncStorage.getItem("storedTheme");
      if (getTheme) {
        setTheme(getTheme);
      }
    };
    loadTheme();
  }, []);

  const saveTask = async () => {
    if (taskText.trim()) {
      const newTask = {
        text: taskText,
        id: Date.now().toString(),
        complete: false,
      };

      const updateArray = [...taskArray, newTask];
      setTaskArray([...taskArray, newTask]);
      setTaskText("");
      await AsyncStorage.setItem("storedTasks", JSON.stringify(updateArray));
    }
  };

  const toogleTheme = async () => {
    const saveTheme = theme == "light" ? "dark" : "light";
    await AsyncStorage.setItem("storedTheme", saveTheme);
    setTheme(saveTheme);
  };

  const removeTask = async (id) => {
    requestAnimationFrame(async () => {
      const filteredTasks = taskArray.filter((task) => task.id !== id);
      setTaskArray(filteredTasks);
      await AsyncStorage.setItem("storedTasks", JSON.stringify(filteredTasks));
    });
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        <Text>{item.text}</Text>
        <TouchableOpacity onPress={() => removeTask(item.id)}>
          <Text>Eliminar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        theme == "light" ? styles.lightTheme : styles.darkTheme,
      ]}
    >
      <StatusBar style="auto" />
      <Text>Tema actual: {theme}</Text>
      <Button title="Change theme" onPress={toogleTheme} />
      <TextInput
        style={styles.textInput}
        placeholder="Write a task..."
        value={taskText}
        onChangeText={(text) => setTaskText(text)}
      />
      <Button title="Add" onPress={saveTask} />
      <FlatList
        data={taskArray}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lightTheme: {
    backgroundColor: "#fff",
    color: "#333",
  },
  darkTheme: {
    backgroundColor: "#333",
    color: "#fff",
  },
  textInput: {
    margin: 20,
    borderWidth: 1,
    padding: 8,
    borderColor: "#333",
    width: "80%",
  },
});
