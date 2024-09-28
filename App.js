
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { LogBox } from 'react-native';
// LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);
// import the screens
import Start from './components/Start';
import Chat from './components/Chat';



const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyC9wbNAaj6fRvC4YbonmdsAjE7IY7aRLRM",
    authDomain: "chitchat-ck-cf.firebaseapp.com",
    projectId: "chitchat-ck-cf",
    storageBucket: "chitchat-ck-cf.appspot.com",
    messagingSenderId: "311399544610",
    appId: "1:311399544610:web:441c7927193db2bbc5977b"
  };

  const app = initializeApp(firebaseConfig);

  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore(app);

  // Create the navigator
const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
   <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat db={db} auth={auth} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;


