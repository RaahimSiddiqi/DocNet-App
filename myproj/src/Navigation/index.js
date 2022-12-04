import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
//screens for stack
import SigninScreen from '../screens/SigninScreen'
import Register from '../screens/RegisterScreen'
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MedicalHistoryScreen from '../screens/MedicalHistoryScreen';
import CertificationScreen from '../screens/CertificationScreen';
import PostCreationScreen from '../screens/PostCreationScreen';
import PolicyScreen from '../screens/PolicyScreen/PolicyScreen';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';
import PostViewScreen from '../screens/PostViewScreen';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import Footer from '../components/Footer';
import React from 'react';
import { IconButton } from 'react-native-paper';

const Stack = createNativeStackNavigator();
const Navigation = () => {
  const screens = {
    SignIn: SigninScreen,
    Registration: Register,
    HomeScreen: HomeScreen,
    Profile: ProfileScreen,
    MedicalHistory: MedicalHistoryScreen,
    Certification: CertificationScreen,
    PostCreation: PostCreationScreen,
    Policy: PolicyScreen,
    Settings: SettingsScreen,
    PostView : PostViewScreen,
  }
  const [routeName, setrouteName] = React.useState();
  const navigationContainerRef = createNavigationContainerRef();

  const headerOptions = {
    contentStyle : {
      backgroundColor : "transparent",
    },
    title: "",
    headerRight : () => routeName === "HomeScreen" &&
                          <IconButton
                            size={30} 
                            icon="account-circle"
                            onPress={() => navigationContainerRef.current?.navigate("Profile")}/>
  }

  return (
    <NavigationContainer
      ref={navigationContainerRef}
      onReady={() => setrouteName(navigationContainerRef.current.getCurrentRoute().name)}
      onStateChange = {async () => setrouteName(navigationContainerRef.current.getCurrentRoute().name)}
    >
      <Stack.Navigator screenOptions={headerOptions}>
        {
          Object.keys(screens).map((key, index) =>
            <Stack.Screen  name={key} key={index} component={screens[key]} />
          )
        }
      </Stack.Navigator>
      <Footer routeName={routeName} />    
    </NavigationContainer>
  )
}

export default Navigation