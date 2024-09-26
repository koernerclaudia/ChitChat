import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView} from 'react-native';
import { GiftedChat } from "react-native-gifted-chat";


const Chat = ({ route, navigation }) => {
  const { name } = route.params;
  const [messages, setMessages] = useState([]);
  const onSend = (newMessages) => {
   setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
 }

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer wannabe",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);


  useEffect(() => {
    navigation.setOptions({ title: name })
  }, []);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1
        }}
      />
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
    </View>
  )


}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Chat;