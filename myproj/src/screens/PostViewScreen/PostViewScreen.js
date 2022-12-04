import { useContext } from "react";
import { ScrollView, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { authContext, themeContext } from "../../context";
import { useContext } from "react";
import axios from "axios";
import { SERVER_IP, SERVER_PORT } from "../../../config";

export default PostViewScreen = ({ route }) => {
    const {postId, userName, title, body, category, creationTime} = route.params;
    const { auth } = useContext(authContext);
    const { theme } = useContext(themeContext);
    const styles = createStyles(theme);

    function deletePost(recordId) {
        axios.post(`http://${SERVER_IP}:${SERVER_PORT}/posts/deletePost`, {
          postId: postId
        },
        {
          headers: {
            "authorization": `BEARER ${auth.accessToken}`
          },
          timeout : 5000
        })
        .then((response) => {
          console.log("deleted post");
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
        <ScrollView style={{flex : 1, padding : 20}}>
             <View style = {{flexDirection : "row", alignItems : "center"}}>
                <IconButton icon="account-circle" size={40}/>
                <View>
                    <Text variant="titleMedium">{userName}</Text>
                    
        {/* <View style = {{flexDirection : "row", alignItems : "center", marginLeft: 'auto'}}>
            <IconButton icon="share"/>
            {auth.userName === userName && <IconButton onPress={deletePost} icon="trash-can"/>}
        </View> */}
                    <View style = {{flexDirection : "row"}}>
                        <Text style ={styles.category}>c/{category}</Text>
                        <Text> on {creationTime.split('T')[0]}</Text>
                    </View>
                </View>
            </View>
            <Text style = {styles.title} variant = "headlineSmall">{title}</Text>
            <Text variant = "bodyLarge" style = {styles.body}>{body}</Text>
        </ScrollView>
    );
}

const createStyles = ({ colors }) => StyleSheet.create({
    category : {
        // color : colors.secondaryText
    },
    title : {
        fontWeight : 'bold',
    },
    body : {
        marginTop : 10,
    }
});