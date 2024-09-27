import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
  const { name, backgroundColor } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  };

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
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
  }, []);

  // Function to determine if the color is light or dark
  const isLightColor = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 128; // Threshold for light/dark
  };

  // Determine text color for system messages based on background color
  const textColor = isLightColor(backgroundColor) ? '#000' : '#FFF';

  // Custom render function for messages
  const renderMessage = (props) => {
    const { currentMessage } = props;

    if (currentMessage.system) {
      // Custom rendering for system messages
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={[styles.systemMessageText, { color: textColor }]}>
            {currentMessage.text}
          </Text>
        </View>
      );
    }

    // Default rendering for normal messages (including bubbles)
    return <Bubble {...props} wrapperStyle={{
      left: {
        backgroundColor: backgroundColor === '#FFFFFF' ? '#E1FFC7' : '#FFF', // Adjust for light backgrounds
      },
      right: {
        backgroundColor: '#007AFF', // Custom color for user's messages
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
        renderMessage={renderMessage} // Use the custom renderMessage
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
    fontWeight: 'bold',
  },
});

export default Chat;
