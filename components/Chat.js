import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import { GiftedChat, Bubble, Send, InputToolbar } from "react-native-gifted-chat";
import { format } from 'date-fns'; 
import { collection, onSnapshot, query, addDoc, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

// Chat component
const Chat = ({ route, navigation, db, isConnected, storage}) => {
  const { name, backgroundColor, userID } = route.params;
  const [messages, setMessages] = useState([]);

  let unsubMessages;

  // Load messages from Firebase when online, otherwise load from cache
  useEffect(() => {
 if (isConnected === true) {
  if (unsubMessages) unsubMessages();
  unsubMessages = null;
  navigation.setOptions({ title: name });
  const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
 unsubMessages = onSnapshot(q, (docs) => {
    let newMessages = [];
    docs.forEach(doc => {
      newMessages.push({ id: doc.id, ...doc.data(), createdAt: new Date(doc.data().createdAt.toMillis()), })
    });
    cacheMessages(newMessages);
    setMessages(newMessages);
  });
 // Add system message when user enters the chat
 const systemMessage = {
  _id: Math.random().toString(36).substr(2, 9), // Generate a random ID for the message
  text: `${name} has entered the chat!`,
  createdAt: new Date(),
  system: true, // Marking this as a system message
};

// Add system message to both local state and Firebase
addDoc(collection(db, "messages"), systemMessage);
setMessages((previousMessages) => GiftedChat.append(previousMessages, [systemMessage]));

} else {
loadCachedChat();
}

// Clean up code
return () => {
if (unsubMessages) unsubMessages();
};
}, [isConnected]);


// Retrieve messages from server / Firebase, if there are any.
const loadCachedChat = async () => {
  const cachedChats = await AsyncStorage.getItem("messages") || [];
  setMessages(JSON.parse(cachedChats));
}

// Save messages to cache and send to Firebase when back online
const cacheMessages = async (MessagesToCache) => {
  try {
    await AsyncStorage.setItem('messages', JSON.stringify(MessagesToCache));
  } catch (error) {
    console.log(error.message);
  }
}

  

  // The text field to enter text is available when the user is on a network. When a user is offline the text field is not visible.
// Offline users can see messages but can’t compose new messages.
const renderInputToolbar = (props) => {
  if (isConnected) return <InputToolbar {...props} containerStyle={styles.inputToolbarContainer} // Customize the input toolbar container style
  />;
  else return null;
 };

  // Custom render function for the "Send" button
  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendButtonContainer}>
          <Text style={styles.sendButtonText}>Send</Text>
        </View>
      </Send>
    );
  };

  // Function to send messages to Firebase
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  }

  // Function to delete cached messages
  const deleteCachedMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
      console.log("Cached messages deleted successfully.");
      setMessages([]); // Clear local state messages
    } catch (error) {
      console.log("Failed to delete cached messages:", error);
    }
  };


  // Function to determine if the background color is light or dark
  const isLightColor = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 128; // Threshold for light/dark
  };

  // Determine text color for system messages based on background color
  const textColor = isLightColor(backgroundColor) ? '#292929' : '#FFFFFF';

  // Custom render function for messages
 const renderMessage = (props) => {
  const { currentMessage } = props;

  if (currentMessage.system) {
    const formattedDate = format(new Date(currentMessage.createdAt), 'PPpp');
    return (
      <View style={styles.systemMessageContainer}>
        <Text style={[styles.systemMessageDate, { color: textColor }]}>
          {formattedDate}
        </Text>
        <Text style={[styles.systemMessageText, { color: textColor }]}>
          {currentMessage.text}
        </Text>
      </View>
    );
  }

  return (
    <View>
       {/* Custom bubble component for messages for left and right side */}
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#E1FFC7',
            marginVertical: 5,
            marginHorizontal: 10,
          },
          right: {
            backgroundColor: '#588493',
            marginVertical: 5,
            marginHorizontal: 10,
          },
        }}
        renderMessageText={() => (
          <View>
            {/* put sender's name into the message bubble */}
            <Text style={styles.senderNameInsideBubble}>
              {currentMessage.user.name} {/* Display the user's name */}
            </Text>
            {currentMessage.text ? (
              <Text style={styles.messageText}>
                {currentMessage.text}
              </Text>
            ) : null}
            {currentMessage.image ? (
              <Image
                source={{ uri: currentMessage.image }}
                style={{ width: 150, height: 100, borderRadius: 13 }}
              />
            ) : null}
            {currentMessage.location ? (
              <MapView
                style={{ width: 150, height: 100, borderRadius: 13 }}
                region={{
                  latitude: currentMessage.location.latitude,
                  longitude: currentMessage.location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              />
            ) : null}
          </View>
        )}
      />
    </View>
  );
};

  // Custom component for the action button
  const renderCustomActions = (props) => {
    return <CustomActions userID={userID} onSend={onSend} storage={storage} {...props} onTyping={handleTyping}/>;
  };

  const renderCustomView = (props) => {
    const { currentMessage} = props;
    if (currentMessage.location) {
      return (
          <MapView
            style={{width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3}}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
      );
    }
    return null;
  }
// Shows a little animation of  3 dots when something is being loaded as a message. But only to the sender themselves.
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    // Send the message to Firebase
    addDoc(collection(db, "messages"), messages[0]);
    setIsTyping(false); // Stop typing indicator after sending
  };
  
  const handleTyping = (status) => {
      setIsTyping(status); // Set the typing status
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <GiftedChat
      

        messages={messages}
        renderMessage={renderMessage}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar} // Custom input toolbar for message input
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        onSend={(messages) => handleSend(messages)}
        user={{
            _id: userID,
            name: name,
        }}
        isTyping={isTyping} // Pass the typing status to Gifted Chat
      
      />

 {/* Button to delete cached messages - messages are only deleted locally, not from Firebase. Works in online and offline mode. */}
 <TouchableOpacity style={styles.clearButton} onPress={deleteCachedMessages}>
        <Text style={styles.clearButtonText}>Clear Cached Messages</Text>
      </TouchableOpacity>

 {/* Below code ensures that the input fields are visible when the keyboard opens on devices. */}
      {/* {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null} */}
      {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  senderNameInsideBubble: {
    fontSize: 10,               // Smaller font size for the name
    fontWeight: 'bold',         // Bold text for the name
    color: '#292929',           // Adjust color based on your theme
    marginBottom: 2,            // Space between the name and the message text
    padding: 5,
  },
  messageText: {
    fontSize: 16,               // Standard message text size
    color: '#292929',           // Adjust color based on your theme
    marginVertical: 5,  // Space between bubbles vertically
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  systemMessageContainer: {
    alignItems: 'center', // Center the system message
    marginVertical: 10,
  },
  systemMessageText: {
    fontSize: 16,
    fontWeight: '300',
  },
  systemMessageDate: {
    fontSize: 12,
    fontStyle: '300',
    color: '#757083',
    marginBottom: 10, // Space between the message and the date
  },

  boldText: {
    fontWeight: 'bold', // Bold font for the name
  },

  inputToolbarContainer: {
    borderTop: 0,                // Remove the top border
    marginVertical: 'auto',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',

  },
  sendButtonContainer: {
    width: 63,
    height: 33,
    backgroundColor: 'orange',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 'auto',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  clearButton: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    alignSelf: 'center', // Center button horizontally
    marginVertical: 10, // Add vertical margin for spacing
    width: '80%', // Make button width relative for better visibility
  },
  clearButtonText: {
    color: '#292929',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Chat;