import { useContext } from "react";
import { ScrollView, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { themeContext } from "../../context";
import { StyleSheet } from "react-native";
export default PostViewScreen = ({ route }) => {
    const {userName, title, body, category, creationTime} = route.params;
    const { theme } = useContext(themeContext);
    const styles = createStyles(theme);
    console.log(route.params);
    return (
        <ScrollView style={{flex : 1, padding : 20}}>
             <View style = {{flexDirection : "row", alignItems : "center"}}>
                <IconButton icon="account-circle" size={40}/>
                <View>
                    <Text variant="titleMedium">{userName}</Text>
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