# ChitChat - Native Mobile App, built with ReactNative


## Project Details:

This is another app I created uring my studies with CareerFoundry. 

The task was to build a chat app for mobile devices using React Native. The app provides users with a chat interface and options to share images and their location.

## TechStack:

- **Build**: ReactNative with Expo
- ** UI Libraries**: GiftedChat (and more...) Navigation, Maps...
- **Data storage**: Google Firebase
- **Testing**: iOS Simulator, Android Emulator, iPhone 14

## Key features & Components:

- A Welcome Screen (Screen 1 of 2) where users can enter their name and choose a background color for the chat screen
before joining the chat (Screen 2 of 2).
- The app authenticates users anonymously via Google Firebase authentication.
- This 2nd screen displaying the conversation between chat members.
- People can send
    - text messages
    - images from their local photo library app
    - take images and send them
    - send their location (map integration, connection to native map app).
- Data can be stored online (Firebase Cloud Storage) and offline, users can clear the screen.
- extra: I have added system messages that show when a person has entered the chat.

## WIP features:

- Names of Chat participants are appearing in the speech bubbles, but not yet when imagery / maps are sent.
- CSS needs to be fixed a bit for light/ dark background adjustment.


## Tools & resources used

- Testing: 
    - Android Emulator / Android Studio // https://developer.android.com/studio; 
    - iOS Simulator // via Xcode on Mac
    - iPhone 14 / ExpoGo App
- CLI: Expo Dev & SDKs // https://expo.dev/
- Metro Bundler (starting up the project on different platforms)
- Code Editor: VS-Code
- Gifted Chat: Mobile UI Library
- GenAI: Chat GPT & Claude to figure out coding patterns and methods and add other small features


## Deployment / Setup the app (status October 2024)

#### 1. Download the repo 

or create a branch and set up the project locally.

#### 2. Get an Expo account and download the app on your phone.
https://expo.dev/

#### 3. Navigate to where you downloaded/ set up the project locally. Set up this particular version of Node.

````
nvm install 16.19.0
nvm use 16.19.0
nvm alias default 16.19.0
````

#### 4. Set up Expo

To create new projects and start running Expo, you’ll need to install the Expo CLI on your machine. (Use your credentials to log into Expo via the CLI)

````
npm install -g expo-cli
expo login
````

#### 5. Create an Expo project

````
npx create-expo-app chitchat --template
`````
pick the option for: Blank

#### 6. Check the Package.Json file for dependencies and install them via npm

Gifted Chat
````
npm install react-native-gifted-chat --save
````
Firebase (Google Database Storage)
````
npm install firebase@10.3.1 --save

````
React Native Navigaton
````
npm install @react-navigation/native @react-navigation/native-stack
expo install react-native-screens react-native-safe-area-context
`````

#### 7. Set up Google Firebase

- Go to: https://firebase.google.com/ and log into the console
- Create a new project and name it (disable Google Analytics)
- Go to Build -> Firestore Database -> Create Database -> Pick region
- Choose 'in production mode' -> Next
- Go to 'Rules'
- Set below line in the configuration to 'true':
````
allow read, write: if false;
````
- Then -> Publish.

- Then set up a collection for 'messages'. The app already includes all the code for the collection to be filled automatically.

- You will find the Firebase configuration info in the App.js file:
````
 // Firebase configuration
  const firebaseConfig = {}
````


#### 8. Run the project
````
npx expo start
````
This command will bring up a list of other commands you can use to start your project on simulators and emulators.

#### 9. Use Emulators

- Android Studio - https://developer.android.com/studio
and follow this guide to set up a virtual device:
https://developer.android.com/studio/run/managing-avds

- Xcode - iOS (Mac Users only)
````
xcode-select --install
open -a Simulator
````

## Licenses

This project is licensed under the MIT License.

## Training offers at Career Foundry

I am super thankful to have found this **Full Stack Web Dev Training** I am on with **CareerFoundry**. They provide a variety of trainings for digital careers. Go check them out!
https://careerfoundry.com/
