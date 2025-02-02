
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
import { useNetInfo }from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { LogBox, Alert, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);
import { getStorage } from "firebase/storage";

  // Create the navigator
  const Stack = createNativeStackNavigator();

  // NetInfo determines whether users are online or offline;
const App = () => {
  const connectionStatus = useNetInfo(); 

  // if offline, the app will disable Firestore network access
useEffect(() => {
  if (connectionStatus.isConnected === false) {
    Alert.alert("Connection Lost!");
    disableNetwork(db);
  } else if (connectionStatus.isConnected === true) {
    enableNetwork(db);
  }
}, [connectionStatus.isConnected]);

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC9wbNAaj6fRvC4YbonmdsAjE7IY7aRLRM",
    authDomain: "chitchat-ck-cf.firebaseapp.com",
    projectId: "chitchat-ck-cf",
    storageBucket: "chitchat-ck-cf.appspot.com",
    messagingSenderId: "311399544610",
    appId: "1:311399544610:web:441c7927193db2bbc5977b"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore(app);
    const storage = getStorage(app);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
    <NavigationContainer>
   <Stack.Navigator
        initialRouteName="Start"
      >
      <Stack.Screen 
          name="Start" 
          component={Start} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat
            isConnected={connectionStatus.isConnected}
            db={db}
            storage={storage}
            {...props}
          />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    </View>
    </TouchableWithoutFeedback>
  );
}

export default App;

