import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity, Platform, KeyboardAvoidingView, Alert} from 'react-native';
import { getAuth, signInAnonymously } from "firebase/auth";


const Start = ({ navigation }) => {
  const auth = getAuth();

  // users get authenticated by Firebase
  const [name, setName] = useState('');

  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate("Chat", {userID: result.user.uid, name, backgroundColor: background || defaultBackgroundColor});
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try later again.");
      })
  }

  // Background colors for the chat screen
  const colors = ['#465362', '#4E5090', '#9BC5D4', '#F1E1CB']; // defining the colours to choose from
  const [background, setBackground] = useState(colors[0]);

  // Default background color, if the user does not pick one
  const defaultBackgroundColor = '#465362'; // setting the default background color

  return (
    <ImageBackground 
    source={require('../assets/BackgroundImage.png')} // Setting the background image for the start screen
    style={styles.backgroundImage}
  >
    <View style={styles.container}>
    <View style={styles.titleBox}>
    <Text>
  <Text style={styles.chit}>Chit</Text>
  <Text style={styles.chat}>Chat</Text>
</Text>
    </View>
    <View style={styles.entryBox}>
      <TextInput
        style={styles.textInput}
        value={name}
        onChangeText={setName}
        placeholder='Type your username here'
      />
       <Text style={styles.chooseBgColor}>Choose a Background Color</Text>
       <View style={styles.colorButtonContainer}>
           {colors.map((color, index) => (
             <TouchableOpacity
               key={index}
               accessible={true}
               accessibilityRole="button"
               accessibilityHint="Lets you choose background color for your chat screen"
               style={[
                styles.colorButton,
                { backgroundColor: color },
                background === color && styles.selectedColor, // Apply orange border if selected
              ]}
              onPress={() => setBackground(color)}
            />
           ))}
        </View>
        <View style={styles.button} >
        <TouchableOpacity onPress={signInUser}>
        <Text style={styles.buttonText}>Start Chatting!</Text>
          </TouchableOpacity>
      </View></View>
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      {Platform.OS === "ios"?<KeyboardAvoidingView behavior="padding" />: null}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',  // or 'contain', depending on your need
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  titleBox: {
      flex:7,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chit: {
      fontSize: 45,
      fontWeight: '600',
      color: 'white',
    },
    chat: {
      fontSize: 45,
      fontWeight: '600',
      color: 'orange',
    },
    textInput: {
      width: "90%",
      backgroundColor: 'white',
      padding: 15,
      borderWidth: 1,
      borderRadius: 5,
      fontSize: 16,
      fontWeight: '300',
      color: '#465362',
      borderColor: 'orange',
      
    },
    entryBox: {
      flex:5,
      backgroundColor: 'white', 
      width: '90%',
      marginTop: 25,
      marginBottom: 50,
      alignItems: 'center',
      borderRadius: 5,
      justifyContent: 'space-around',
      
    },
  
  button: {
    width: "90%",
    alignItems: 'center',
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  chooseBgColor:{
    color: '#465362',
    fontSize: 16,
    fontWeight: '300',
    opacity: 100,
   
  },
  colorButtonContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
  
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    margin: 10
},
selectedColor:{
    borderColor: 'orange',
    borderWidth: 3, 
},
  
});

export default Start