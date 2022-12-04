import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { authContext } from "../../context";
import { useContext } from "react";
import axios from "axios";
import { SERVER_IP, SERVER_PORT } from "../../../config";

export default PostViewScreen = ({ route }) => {
    const {postId, userName, title, body, category} = route.params;
    const { auth } = useContext(authContext);

    console.log(auth);


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
        <View style={{flex : 1}}>
             <View style = {{flexDirection : "row", alignItems : "center"}}>
                <View style = {{flexDirection : "row", alignItems : "center", marginRight: 'auto'}}>
                    <IconButton icon="account-circle" size={25}/>
                    <Text variant="titleMedium">{userName}</Text>
                </View>

                <View style = {{flexDirection : "row", alignItems : "center", marginLeft: 'auto'}}>
                    <IconButton icon="share"/>
                    {auth.userName === userName && <IconButton onPress={deletePost} icon="trash-can"/>}
                </View>
            </View>
            <Text>Category : {category}</Text>
        </View>
    );
}