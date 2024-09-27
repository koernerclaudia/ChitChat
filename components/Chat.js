import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { GiftedChat, Bubble, Send, InputToolbar } from "react-native-gifted-chat";
import { format } from 'date-fns'; // Use date-fns or another date formatting library

const Chat = ({ route, navigation }) => {
  const { name, backgroundColor } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
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

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbarContainer} // Customize the input toolbar container style
      />
    );
  };

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer wannabe...',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: `${name} has entered the chat!`,
        createdAt: new Date(),
        system: true, // Marking this message as a system message
      },
    ]);
  }, [name]);

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [name]);

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
          _id: 1,
        }}
        renderSend={renderSend} // Custom renderSend to style "Send"
        renderInputToolbar={renderInputToolbar} // Custom input toolbar for message input
        renderMessage={renderMessage}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: 'center',
  },
  sendButtonContainer: {
   marginTop: 5,
  },
  sendButtonText: {
    color: '#588493', // Change this to the color you want for the 'Send' text
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Chat;
