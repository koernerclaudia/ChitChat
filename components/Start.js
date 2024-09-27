import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity, Platform, KeyboardAvoidingView} from 'react-native';

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const colors = ['#465362', '#4E5090', '#9BC5D4', '#F1E1CB']; // defining the colours to choose from
  const [background, setBackground] = useState(colors[0]);

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
        <TouchableOpacity onPress={() => navigation.navigate('Chat', { name, backgroundColor: background || defaultBackgroundColor })}>
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
      flex:6,
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
      width: "88%",
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
      flex:6,
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
    padding: 10,
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