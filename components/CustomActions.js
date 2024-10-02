import React from 'react';
import { TouchableOpacity, Text, View, Alert, StyleSheet} from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


const CustomAction = ({ wrapperStyle, iconTextStyle, onSend, storage, userID, onTyping }) => {
    const actionSheet = useActionSheet();
  
    const onActionPress = () => {
      const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
      const cancelButtonIndex = options.length - 1;
      actionSheet.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        async (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              pickImage();
              return;
            case 1:
              takePhoto();
              return;
            case 2:
              getLocation();
                return;
            default:
                
          }
        },
      );
    };

    
 
    
      const pickImage = async () => {
        onTyping(true); 
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissions?.granted) {
          let result = await ImagePicker.launchImageLibraryAsync();
          if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
          else Alert.alert("Permissions haven't been granted.");
        }
        onTyping(false); // Stop typing indicator
      }
    
      const takePhoto = async () => {
        onTyping(true);
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions?.granted) {
          let result = await ImagePicker.launchCameraAsync();
          if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
          else Alert.alert("Permissions haven't been granted.");
        }
        onTyping(false); // Stop typing indicator
      }


      const getLocation = async () => {
        onTyping(true); // Notify that user is "typing" (fetching location)
        let permissions = await Location.requestForegroundPermissionsAsync();
        if (permissions?.granted) {
          const location = await Location.getCurrentPositionAsync({});
          if (location) {
            onSend([{
                _id: `${userID}-${new Date().getTime()}`, // Generate a unique ID
                createdAt: new Date(),
                user: {
                  _id: userID,
                  name: ''
                },
                location: {
                  longitude: location.coords.longitude,
                  latitude: location.coords.latitude,
                },
              }]);
          } else Alert.alert("Error occurred while fetching location");
        } else Alert.alert("Permissions haven't been granted.");
        onTyping(false); // Stop typing indicator
      };

      const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        return `${userID}-${timeStamp}-${imageName}`;
      }

      const uploadAndSendImage = async (imageURI) => {
        const uniqueRefString = generateReference(imageURI);
        const newUploadRef = ref(storage, uniqueRefString);
        const response = await fetch(imageURI);
        const blob = await response.blob();
    
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
            const imageURL = await getDownloadURL(snapshot.ref);
    
            // Construct the message object for Gifted Chat
            const message = {
                _id: Math.random().toString(36).substring(7), // Unique message ID
                text: '', // Empty text because this is an image message
                createdAt: new Date(), // Current timestamp
                user: {
                    _id: userID, // User ID sending the message
                    name: 'User Name', // Replace this with the actual user name
                },
                image: imageURL, // The image URL from Firebase
            };
    
            // Send the message with the image to Gifted Chat
            onSend([message]);
        });
    };
    


return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
    <View style={[styles.wrapper, wrapperStyle]}>
      <Text style={[styles.iconText, iconTextStyle]}>+</Text>
    </View>
      </TouchableOpacity>
    );

};

const styles = StyleSheet.create({
    container: {
      width: 33,
      height: 33,
      marginLeft: 5,
      marginVertical: 5,
    },
    wrapper: {
      borderRadius: 17,
      flex: 1,
      backgroundColor: 'orange',
    },
    iconText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20,
      backgroundColor: 'transparent',
      textAlign: 'center',
      justifyContent: 'center',
      margin: 'auto',
    },
  });
  

export default CustomAction;