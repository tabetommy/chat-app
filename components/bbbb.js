import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connectActionSheet } from "@expo/react-native-action-sheet";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
// import * as Location from "expo-location";
import "firebase/compat/auth";
import "firebase/compat/firestore";

class CustomActions extends React.Component {

//  Let the user pick an image from the device's image library
 imagePicker = async () => {
    // expo permission
    const { status } = await Permissions.getCameraRollPermissionsAsync();
    try {
      if (status === "granted") {
        // pick image
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, // only images are allowed
        }).catch((error) => console.log(error));
        // canceled process
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
//   Let the user take a photo with device's camera
  takePhoto = async () => {
    const { status } = await Permissions.requestCameraPermissionsAsync();
    try {
      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));
        console.log(result)
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };


// get the location of the user by using GPS

// getLocation = async () => {
//   try {
//     const { status } = await Permissions.askAsync(Permissions.LOCATION);
//     if (status === "granted") {
//       const result = await Location.getCurrentPositionAsync(
//         {}
//       ).catch((error) => console.log(error));
//       const longitude = JSON.stringify(result.coords.longitude);
//       const altitude = JSON.stringify(result.coords.latitude);
//       if (result) {
//         this.props.onSend({
//           location: {
//             longitude: result.coords.longitude,
//             latitude: result.coords.latitude,
//           },
//         });
//       }
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };



/*Upload images to firebase*/
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

    const ref = firebase.storage().ref().child(`images/${imageName}`);

    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  // ACTION SHEET 
  onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length- 1;
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log("user wants to pick an image");
            return this.imagePicker();
          case 1:
            console.log("user wants to take a photo");
            return this.takePhoto();
          case 2:
            console.log("user wants to get their location");
            // this.getLocation();
          default:
            break;
        }
      }
    );
  };

  render() {
    return (
      <TouchableOpacity
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
    // fontWeight: 700,
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});


CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
   };

export default connectActionSheet(CustomActions);

 // get the location of the user by using GPS
 getLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  try {
    if (status === "granted") {
      let result = await Location.getCurrentPositionAsync({})
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

  const ref = firebase.storage().ref().child(`images/${imageName}`);

  const snapshot = await ref.put(blob);

  blob.close();

  return await snapshot.ref.getDownloadURL();
};