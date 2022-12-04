import { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { themeContext } from "../../context";
import { StyleSheet } from "react-native";
import axios from "axios";
import { SERVER_IP, SERVER_PORT } from "../../../config";
import CommentSection from "../../components/CommentSection";
import { Alert } from "react-native";
export default PostViewScreen = ({ route }) => {
    const { postId, userName, title, body, category, creationTime } = route.params;
    const { theme } = useContext(themeContext);
    const styles = createStyles(theme);
    const [commentsData, setcommentsData] = useState([]);
    useEffect(() => {
        axios.get(`http://${SERVER_IP}:${SERVER_PORT}/comments/getComments/${postId}`, { timeout: 5000 })
            .then((response) => {
                const makeForest = (commentId, data) =>
                    data.filter(({ parentCommentId }) => parentCommentId === commentId)
                        .map(({ commentId, parentCommentId, ...rest }) => ({ commentId, ...rest, replies: makeForest(commentId, data) }))

                setcommentsData(makeForest(null, response.data));
            })
            .catch((error) => {
                if (error.response) {
                    Alert.alert("Invalid request.", "Your request could not be processed. Please try again later or contact support.");
                }
                else
                    Alert.alert("404", "The server is irresponsive. Please try again later or contact support.");
            })
    }, [])

    return (
        <ScrollView style={{ flex: 1, padding: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <IconButton icon="account-circle" size={40} />
                <View>
                    <Text variant="titleMedium">{userName}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.category}>c/{category}</Text>
                        <Text> on {creationTime.split('T')[0]}</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.title} variant="headlineSmall">{title}</Text>
            <Text variant="bodyLarge" style={styles.body}>{body}</Text>
            <CommentSection data={commentsData} />
        </ScrollView>
    );
}

const createStyles = ({ colors }) => StyleSheet.create({
    category: {
        // color : colors.secondaryText
    },
    title: {
        fontWeight: 'bold',
    },
    body: {
        marginTop: 10,
        borderBottomColor : 'gray',
        borderBottomWidth : 3
    }
});