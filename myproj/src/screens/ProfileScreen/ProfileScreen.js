import { View ,Image, StyleSheet, ImageBackground, useWindowDimensions, ScrollView, KeyboardAvoidingView, Alert} from 'react-native'
import React ,{useState, useCallback, useEffect, useContext} from 'react'
import { Icon, Text, TextInput, Button, Title, Paragraph,  SegmentedButtons, FAB, Avatar} from 'react-native-paper';
import profilePic from "../../../assets/profile.png"
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import ProfileView from '../../components/ProfileView';
import ActivityView from '../../components/ActivityView';
import MedicalHistoryView from '../../components/MedicalHistoryView';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import points from "../../../assets/points.png"
import axios from 'axios';
import { authContext, themeContext } from '../../context';
import { SERVER_IP, SERVER_PORT } from '../../../config';

const ProfileScreen = ({route}) => {
  const navigation = useNavigation()
  const isFocused = useIsFocused();
  const { auth } = useContext(authContext);
  const { theme } = useContext(themeContext);
  const targetUserName = route.params;
  const styles = createStyles(theme);

  const [hideProfile, setHideProfile] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const window = useWindowDimensions();
  const [routes] = useState([
      { key: 'first', title: 'Profile' },
      { key: 'second', title: 'History' },
      { key: 'third', title: 'Activity' },
    ]);

  const [user, setUser] = useState(null);
  const [history, setHistory] = useState(null);
  const [activty, setActivity] = useState(null);


  function getUser(userName) {
    axios.get(`http://${SERVER_IP}:${SERVER_PORT}/api/getUser/` + userName, {timeout : 5000})
    .then((response) => {
      let temp = response.data.data[0];
      temp["dob"] = temp["dob"].split("T")[0]
      temp["gender"] = temp["gender"]? temp["gender"].toLowerCase() : null;
      setUser(temp);
    })
    .catch((error) => {
      if(error.response){        
        console.log(error.response);
        Alert.alert("Invalid request.", "Your request could not be processed. Please try again later or contact support.");
      }
      else
          Alert.alert("404", "The server is irresponsive. Please try again later or contact support.");
    })
  }

  function getHistory() {
    axios.get(`http://${SERVER_IP}:${SERVER_PORT}/api/getHistory/` + userName, {timeout : 5000})
    .then((response) => {
      setHistory(response.data.data);
    })
    .catch((error) => {
      if(error.response){        
        console.log(error.response.errorCode);
        Alert.alert("Invalid request.", "Your request could not be processed. Please try again later or contact support.");
      }
      else
          Alert.alert("404", "The server is irresponsive. Please try again later or contact support.");
    })
  }

  function getActivity() {
    axios.get(`http://${SERVER_IP}:${SERVER_PORT}/api/getActivity/` + userName, {timeout : 5000})
    .then((response) => {
      setActivity(response.data.data);
    })
    .catch((error) => {
      if(error.response){        
        console.log(error.response.errorCode);
        Alert.alert("Invalid request.", "Your request could not be processed. Please try again later or contact support.");
      }
      else
          Alert.alert("404", "The server is irresponsive. Please try again later or contact support.");
    })
  }

    useEffect(() => {
      userName = targetUserName ? targetUserName : auth.userName;
      getUser(userName);
      getHistory(userName);
      getActivity(userName);
    }, [isFocused])

  const Profile = useCallback(() => {
    // console.log("Profile Component re-render");
    return (
      <ProfileView updateUserDetails={updateUserDetails} profileMode={hideProfile} userDetails={user} toggleProfileMode = {toggleProfileMode} />
    );
  }, [hideProfile, user])
  
  const MedicalHistory = useCallback(() => {
    // console.log("History Component re-render");
    return (
      <MedicalHistoryView userDetails={user} deleteRecord={deleteRecord} userHistory = {history}/>
    );
  }, [history])
  
  const Activity = useCallback(() => {
    // console.log("Activity Component re-render");
    return (
      <ActivityView userActivity = {activty}/>
    );
  }, [activty])
  
  const renderScene = SceneMap({
    first:  Profile,
    second: MedicalHistory,
    third:  Activity
  });

  function toggleProfileMode() {
    setHideProfile(!hideProfile);
  }

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "white" }}
      style={{ backgroundColor: theme.colors.secondary }}
    />
  );


  function updateUserDetails(newUserDetails) {
    setUser({...user, ...newUserDetails});

    axios.put(`http://${SERVER_IP}:${SERVER_PORT}/api/updateProfile`, newUserDetails,
      {
        headers: {
          "authorization": `BEARER ${auth.accessToken}`
        },
        timeout : 5000,
      })
      .then((response) => {
        console.log("Profile updated Successfully");
      })
      .catch(error => {
        if(error.response){
            switch(error.response.data.errorCode){
                case "auth/unauthorized-access":
                    Alert.alert("Unauthorized Access!", "Unauthorized access has been detected. Please log in again.");
                    navigation.navigate("SignIn");
                    break;
                default:
                    console.log(error.response.errorCode);
                    Alert.alert("Invalid request.", "Your request could not be processed. Please try again later or contact support.");
                    break;
            }
        }
        else
            Alert.alert("404", "The server is irresponsive. Please try again later or contact support.");
    });
  }

  function deleteRecord(recordId) {
    axios.post(`http://${SERVER_IP}:${SERVER_PORT}/api/deleteRecord`, {
      recordId: recordId
    },
    {
      headers: {
        "authorization": `BEARER ${auth.accessToken}`
      },
      timeout : 5000
    })
    .then((response) => {
      getHistory();
    })
    .catch(error => {
      if(error.response){
          switch(error.response.data.errorCode){
              case "auth/unauthorized-access":
                  Alert.alert("Unauthorized Access!", "Unauthorized access has been detected. Please log in again.");
                  navigation.navigate("SignIn");
                  break;
              default:
                  console.log(error.response.errorCode);
                  Alert.alert("Invalid request.", "Your request could not be processed. Please try again later or contact support.");
                  break;
          }
      }
      else
          Alert.alert("404", "The server is irresponsive. Please try again later or contact support.");
  });
  }

  return (
      <View style={styles.root}>  
          {user && user.userRole.toLowerCase() == "doctor" && hideProfile == false &&
          <View style={styles.fab}>
            <Image source={points}></Image>
            <View borderRadius={8}>
              <Text style={{...styles.centerX, ...styles.text_small}} variant='bodySmall' color="black">{user.docPoints}</Text>
            </View>
          </View>}

          {hideProfile == false &&
          <View style={{backgroundColor: theme.colors.primaryContainer, width:'100%', paddingBottom:10}}> 
            <View style={{...styles.centerX, paddingBottom:10}}>
              <Image source={profilePic}>
              </Image>
            </View>
            
            <View style={{...styles.centerX}}>
              <Text style={{...styles.centerX, ...styles.text_medium}}>{user && user.userName}</Text>
              <Text style={{...styles.centerX, ...styles.text_small}}>User from: {user && user.joinDate.split('T')[0]}</Text>
            </View>
          </View>
          }
      
          <View style={{flex:1, width:'100%'}}  >
            <TabView
              lazy
              renderTabBar={renderTabBar}
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: window.width }}
            />
          </View>
      </View>
    );
}
 

const createStyles = ({colors}) => StyleSheet.create({
    root : {
      flex:1,
      marginTop: 6
    },
    input : {
      marginVertical:10, 
      backgroundColor : "white",
      color : 'gray'
    },
    button : {
      marginVertical:10,
      borderRadius: 5
    },
    centerX : {
      marginLeft : 'auto', 
      marginRight : 'auto'
    },
    fab: {
      position: 'absolute',
      marginBottom: 16,
      marginLeft: 16,
      marginRight: 16,
      left: 0,
      top: 0,
      zIndex: 99
    },
    heading: {
      color: colors.primaryText,
      fontSize:20
    },
    text_medium : {
        color: colors.primaryText,
        fontSize:16
    },
    text_small : {
        color: colors.primaryText,
        fontSize:13
    },
  })

export default ProfileScreen;