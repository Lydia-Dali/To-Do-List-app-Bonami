import React, { Component } from "react";
import axios from "axios";
import { LinearGradient } from "expo";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Keyboard,
  Platform
} from "react-native";

import { Header, Button, Icon, CheckBox } from "react-native-elements";

const isAndroid = Platform.OS == "android";
const viewPadding = 10;

import moment from "moment";
import fr from "moment/locale/fr";

export default class TodoList extends Component {
  state = {
    tasks: [],
    title: "",
    currentDate: new Date(),
    markedDate: moment(new Date())
      .locale("fr")
      .format("LLL")
  };

  switchTaskDone = task => {
    axios
      .put(`http://192.168.86.27:3000/lists/${task.id}`, {
        is_done: !task.is_done
      })
      .then(response => this.FetchData())
      .catch(error => console.log(error));
  };

  changeTextHandler = title => {
    this.setState({ title: title });
  };

  componentDidMount() {
    this.FetchData();
    Keyboard.addListener(
      isAndroid ? "keyboardDidShow" : "keyboardWillShow",
      e => this.setState({ viewPadding: e.endCoordinates.height + viewPadding })
    );

    Keyboard.addListener(
      isAndroid ? "keyboardDidHide" : "keyboardWillHide",
      () => this.setState({ viewPadding: viewPadding })
    );
  }

  FetchData = async () => {
    const data = await axios.get("http://192.168.86.27:3000/lists");
    this.setState({ tasks: data.data });
  };

  addTask = e => {
    e.preventDefault();
    if (this.state.title.length > 0) {
      axios
        .post("http://192.168.86.27:3000/lists", {
          title: this.state.title
        })
        .then(response => {
          this.FetchData();

          this.setState({ title: "" });
        })
        .catch(error => console.log("error post", error));
    }
  };

  deleteTask = id => {
    axios
      .delete(`http://192.168.86.27:3000/lists/${id}`)
      .then(response => {
        this.FetchData();
      })
      .catch(error => console.log("error delete", error));
  };

  formatCreatedDate(task) {
    return moment(task.created_at)
      .locale("fr")
      .format("LLL");
  }

  render() {
    const strike = {
      textDecoration: this.state.strike
    };
    return (
      <LinearGradient
        colors={["#7cd8cc", "#7cd8cc", "#66b5a9", "#9bc4dc", "white"]}
        style={{ flex: 1 }}
      >
        <View
          style={[styles.container, { paddingBottom: this.state.viewPadding }]}
        >
          <Header
            containerStyle={{
              height: 80,
              paddingBottom: 5,
              marginHorizontal: 0,
              backgroundColor: "#436f8ead"
            }}
            placement="left"
            centerComponent={{
              text: "Bonami To-do List",
              style: { color: "#fff", fontSize: 25, fontWeight: "bold" }
            }}
          />

          <TextInput
            style={styles.textInput}
            onChangeText={this.changeTextHandler}
            onSubmitEditing={e => this.addTask(e)}
            value={this.state.title}
            placeholder="Cliquez Ici pour Ajouter un Nouvelle Tâche"
            returnKeyType="done"
            returnKeyLabel="done"
          />

          <FlatList
            style={styles.list}
            data={this.state.tasks}
            renderItem={({ item, index }) => (
              <View>
                <Text style={[styles.dateItem]}>
                  {this.formatCreatedDate(item)}
                </Text>
                <View style={styles.listItemCont}>
                  <CheckBox
                    containerStyle={{
                      paddingRight: 0,
                      paddingLeft: 0,
                      marginLeft: 0,
                      marginRight: 0
                    }}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={item.is_done}
                    onPress={() => this.switchTaskDone(item)}
                  />

                  <Text
                    style={item.is_done ? styles.troughtText : { width: "70%" }}
                  >
                    {item.title}
                  </Text>
                  <Button
                    onPress={() => this.deleteTask(item.id)}
                    buttonStyle={{
                      height: 40,
                      width: 40,
                      backgroundColor: "rgba(111, 202, 186, 1)",
                      marginRight: 10
                    }}
                    icon={
                      <Icon
                        name="trash"
                        type="evilicon"
                        size={30}
                        color="white"
                      />
                    }
                    iconRight
                    title=""
                  />
                </View>

                <View style={styles.hr} />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: viewPadding,
    paddingTop: 20
  },
  list: {
    width: "90%",
    paddingTop: 20
  },
  dateItem: {
    fontSize: 12,
    color: "white",
    paddingLeft: 20
  },
  listItem: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    fontSize: 16,
    color: "#777",
    width: "70%",
    fontWeight: "bold"
  },
  hr: {
    paddingBottom: 3,
    marginBottom: 10
  },
  listItemCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "white",
    borderColor: "white",
    height: 80,
    elevation: 8
  },
  troughtText: {
    width: "70%",
    color: "orangered",
    textDecorationLine: "line-through"
  },
  textInput: {
    height: 40,
    marginTop: 5,
    paddingRight: 10,
    paddingLeft: 10,
    borderColor: "gray",
    borderWidth: isAndroid ? 0 : 1,
    width: "100%",
    backgroundColor: "gray",
    color: "white"
  },
  listontainerDone: {
    backgroundColor: "black"
  }
});

AppRegistry.registerComponent("TodoList", () => TodoList);
