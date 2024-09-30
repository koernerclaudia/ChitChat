import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView, TouchableOpacity, } from 'react-native';
import { GiftedChat, Bubble, Send, InputToolbar } from "react-native-gifted-chat";
import { format } from 'date-fns'; // Use date-fns or another date formatting library
import { collection, onSnapshot, query, addDoc, where, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected }) => {
  const { name, backgroundColor, userID } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  }

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

// Retrieve messages from server / Firebase, if there are any.
  const loadCachedChat = async () => {
    const cachedChats = await AsyncStorage.getItem("messages") || [];
    setMessages(JSON.parse(cachedChats));
  }
  

  const deleteCachedMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
      console.log("Cached messages deleted successfully.");
      setMessages([]); // Clear local state messages
    } catch (error) {
      console.log("Failed to delete cached messages:", error);
    }
  };

  let unsubMessages;

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
} else loadCachedChat();

// Clean up code
return () => {
  if (unsubMessages) unsubMessages();
}
}, [isConnected]);


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

  // Function to determine if the color is light or dark
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
      // Format the date using date-fns or a similar library
      const formattedDate = format(new Date(currentMessage.createdAt), 'PPpp');

      // Extract the name and message text separately
      const systemMessageText = currentMessage.text.split(name);

      // Custom rendering for system messages
      return (
        <View style={styles.systemMessageContainer}>
           {/* Show the date */}
           <Text style={[styles.systemMessageDate, { color: textColor }]}>
            {formattedDate}
          </Text>
          {/* Render the system message with highlighted name */}
          <Text style={[styles.systemMessageText, { color: textColor }]}>
            {systemMessageText[0]}
            <Text style={styles.highlightedName}>{name}</Text>
            {systemMessageText[1]}
          </Text>
        </View>
      );
    }

    // Default rendering for normal messages (including bubbles)
    return <Bubble {...props} wrapperStyle={{
      left: {
        backgroundColor: backgroundColor === '#FFFFFF' ? '#E1FFC7' : '#FFF', // Adjust for light backgrounds
        marginVertical: 5,           // Space between bubbles vertically
        marginHorizontal: 10,        // Space between bubbles and screen edges
      },
      right: {
        backgroundColor: '#588493', // Custom color for user's messages
        marginVertical: 5,           // Space between bubbles vertically
        marginHorizontal: 10,        // Space between bubbles and screen edges
      },
    }} />;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: userID,
          name: name
      }}
        renderSend={renderSend} // Custom renderSend to style "Send"
        renderInputToolbar={renderInputToolbar} // Custom input toolbar for message input
        renderMessage={renderMessage}
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
  highlightedName: {
    fontWeight: 'bold',
  },
  inputToolbarContainer: {
    borderTop: 0,                // Remove the top border
    paddingHorizontal: 15,      // Add horizontal padding to the input area
    paddingVertical: 5,         // Add vertical padding to adjust the height of the toolbar
    marginBottom: 15,
    alignItems: 'center',
  },
  sendButtonContainer: {
    alignItems: 'center',
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
   justifyContent: 'center',
   margin: 'auto',

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