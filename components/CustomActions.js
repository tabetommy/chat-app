import React from "react";
import PropTypes from "prop-types";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import 'firebase/compat/storage'; 
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

class CustomActions extends React.Component {


  // allows the user to select an existing image from their device’s media library
  selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    try {
      if (status === "granted") {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // allows the user to take a picture with their device's camera
  takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    try {
      if (status === "granted") {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

// uploads images to firebase's firestore
uploadImageFetch = async (uri) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const imageNameBefore = uri.split("/");
  const imageName = imageNameBefore[imageNameBefore.length - 1];
  const firebaseConfig = {
    apiKey: "AIzaSyAZcf4bjU9ubqrvCNUYwJ7tKyNkpG5l25E",
    authDomain: "chatapp-84454.firebaseapp.com",
    projectId: "chatapp-84454",
    storageBucket: "chatapp-84454.appspot.com",
    messagingSenderId: "203169596879",
    appId: "1:203169596879:web:237b4cb66ece80ca4ffeba",
    measurementId: "G-MLJMF5CCCE"
    };
  firebase.initializeApp(firebaseConfig);
  const ref = firebase.storage().ref().child(`images/${imageName}`);


  const snapshot = await ref.put(blob);

  blob.close();

  return await snapshot.ref.getDownloadURL();
};

//get user's location

getLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const result = await Location.getCurrentPositionAsync(
        {}
      ).catch((error) => console.log(error));
      const longitude = JSON.stringify(result.coords.longitude);
      const latitude = JSON.stringify(result.coords.latitude);
      if (result) {
        this.props.onSend({
          location: {
            longitude: result.coords.longitude,
            latitude: result.coords.latitude,
          },
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

  //Action sheet
  onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log("user wants to pick an image");
            this.selectImage();
            break;
          case 1:
            console.log("user wants to take a photo");
            this.takePhoto();
            break;
          case 2:
            console.log("user wants to get their location");
            this.getLocation();
          default:
            break;
        }
      }
    );
  };

  render() {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Options"
        accessibilityHint="You can choose to send an image or your location"
        accessibilityRole="button"
        style={[styles.container]}
        onPress={this.onActionPress}
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

const ConnectedApp = connectActionSheet(CustomActions);

export default ConnectedApp;