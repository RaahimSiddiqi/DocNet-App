import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";

export default PostViewScreen = ({ route }) => {
    const {userName, title, body, category} = route.params;
    console.log(route.params);
    return (
        <View style={{flex : 1}}>
             <View style = {{flexDirection : "row", alignItems : "center"}}>
                <IconButton icon="account-circle" size={25}/>
                <Text variant="titleMedium">{userName}</Text>
            </View>
            <Text>Category : {category}</Text>
        </View>
    );
}