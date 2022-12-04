import { View ,Image, StyleSheet, ImageBackground, useWindowDimensions, ScrollView, Alert } from 'react-native'
import { Avatar, Button, Card, Title, Paragraph, useTheme, FAB, IconButton, Text  } from 'react-native-paper';
import React , {useState, useContext, useEffect} from 'react'
import { useNavigation } from '@react-navigation/native';
import { authContext, themeContext } from '../../src/context';


const MedicalHistoryView = ({userDetails, userHistory, deleteRecord}) => {
    let isAlertActive = 0;
    const { auth } = useContext(authContext);
    const { theme } = useContext(themeContext);
    const styles = createStyles(theme);
    const navigation = useNavigation();

    const LeftContent = props => <Avatar.Icon {...props} iconColor="white" style={{backgroundColor:theme.colors.primary}} icon="needle" />
    const RightContent = props => <View marginRight="auto"><IconButton iconColor={theme.colors.primaryIcon} icon="trash-can" onPress={() => handleDelete(props)}/></View>

    const showAlert = (props) => {
      isAlertActive = 1;
      Alert.alert(
          "Confirmation",
          "Are you sure you want to delete this record?",
          [
            {
              text: "No",
              onPress: () => console.log("exit dialog"),
            },
            { text: "Yes", onPress: () => deleteRecord(props) }
          ]       
    ), isAlertActive = 0;}

    const handleDelete = (props) => {
      console.log(props);
      if (isAlertActive == 0) 
          showAlert(props)
      else 
          deleteRecord(props);
  }

  function renderHistory() {
    return (
          <ScrollView>
            {Object.keys(userHistory).map((key, index) => 
                <Card key = {index} elevation={1} style = {{...styles.card, borderWidth:1, borderColor: theme.colors.primary}}>
                  <Card.Title titleStyle={{fontSize:20, minHeight:'auto', ...styles.heading}} 
                              subtitleStyle={{...styles.text_small}}
                              title={userHistory[key].ailmentName} subtitle={(userHistory[key].startDate ? userHistory[key].startDate.split('T')[0] : "???") + " to " + (userHistory[key].endDate ? userHistory[key].endDate.split('T')[0] : "???")}
                              left={LeftContent} right={() => RightContent(userHistory[key].recordId)}/>
                  <Card.Content>
                    <Paragraph style={{...styles.text_small}}><Text  style={{...styles.text_medium}}>Symptoms: </Text>{userHistory[key].symptoms}</Paragraph>
                    <Paragraph style={{...styles.text_small}}>{userHistory[key].description}</Paragraph>
                  </Card.Content>
                  <Card.Actions>
                    <Button textColor={theme.colors.primaryText} onPress={() => navigation.navigate("MedicalHistory", {operation : "edit", recordDetails: userHistory[key]})} mode="text">Edit</Button>
                  </Card.Actions>
                </Card>       
            )}

            <View style={{paddingBottom:75}}></View>
          </ScrollView>
    );
  }

  function renderConditionalHistory() {
    console.log(auth.userRole, userDetails.privacy)
    if (auth.userRole === "DOCTOR") {
      if (userDetails.privacy === '2') {
        return (<Text>You are not allowed to view this profile</Text>);
      }
      else {
        return (renderHistory());
      }
    }
    else if (auth.userRole === "USER") {
      if (userDetails.privacy === '0') {
        return (renderHistory());
      }
      else {
        return (<Text>You are not allowed to view this profile</Text>);
      }
    }
  }

    return (  
        <>{userDetails &&<>
            {auth.userName === userDetails.userName && <FAB
              color='white'
              icon = "plus"
              style={{...styles.fab, backgroundColor: theme.colors.secondary}}   
              onPress= {() => navigation.navigate("MedicalHistory", {operation : "add"})}
            />}

            <>
              {userHistory.length >= 1 ? 
                <View style = {styles.root}>
                  {auth.userName === userDetails.userName && renderHistory() }   
                  
                  {auth.userName !== userDetails.userName && renderConditionalHistory()}
                </View> : 
                <View style={styles.root}>
                  <Text style={{...styles.center, ...styles.text_medium}}>No Records Found</Text>
                </View>
              }
            </>
        </>}</>
    );
}
 
export default MedicalHistoryView;


const createStyles = ({colors}) => StyleSheet.create({
  root : {
    flex:1,
    backgroundColor: colors.primaryContainer
  },
  center : {
    marginLeft : 'auto', 
    marginRight : 'auto',
    marginTop : 'auto',
    marginBottom: 'auto'
  },
  centerX : {
    marginLeft : 'auto', 
    marginRight : 'auto'
  },
  button : {
    borderRadius: 0
  }, 
  card : {
    marginLeft: 5,
    marginRight: 8,
    marginTop: 10,
    backgroundColor: colors.onPrimaryContainer
  },
  fab: {
    position:'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex:99
  },
  iconButton: {
    boxShadow : "none",
    backgroundColor : 'white',
    borderRadius : 0,
    borderColor : 'transparent',
    borderColor : "white"
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
      fontSize:14
  },
})