import { ScrollView, View } from "react-native";
import { Text, TextInput, IconButton, HelperText } from "react-native-paper";
import { globalStyles } from "../../global";
import { Formik } from "formik";
import * as yup from 'yup';
import axios from "axios";
import { SERVER_IP, SERVER_PORT } from "../../../config";
import { useNavigation } from "@react-navigation/native";
import { authContext } from "../../context";
import { useContext } from "react";
export default PostCreationScreen = () => {
    const navigation = useNavigation();
    const { auth } = useContext(authContext);
    const schema = yup.object({
        title: yup.string().required("Required"),
        body: yup.string().required("Required")
    });
    const onSubmit = (formData) => {
        /* Send formData.title and formData.post  */
        axios.post(
            `http://${SERVER_IP}:${SERVER_PORT}/posts/createPost`,
            {...formData, category : "General"},
            { headers: { "authorization": `BEARER ${auth.accessToken}` }, timeout: 5000 }
        )
            .then(response => {
                navigation.navigate("HomeScreen");
            })
            .catch(error => {
                if (error.response) {
                    switch (error.response.data.errorCode) {
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

        console.log(formData);
    }
    return (
        <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{
                title: "",
                body: ""
            }}
            onSubmit={onSubmit}
            validationSchema={schema}
        >
            {({ handleChange, handleSubmit, values, errors }) => (
                <View style={{ flex: 1 }}>
                    <IconButton
                        icon="check"
                        iconColor="white"
                        mode="contained"
                        size={45}
                        style={{ backgroundColor: "#3796f3", position: 'absolute', bottom: 10, right: 10, zIndex: 1 }}
                        onPress={handleSubmit}
                    />
                    <ScrollView>
                        <TextInput
                            placeholder="Title"
                            style={{ fontWeight: 'bold', backgroundColor: "transparent", fontSize: 25, paddingVertical: 10 }}
                            mode='flat'
                            value={values.title}
                            onChangeText={handleChange("title")}

                        />

                        <HelperText
                            type="error"
                            visible={() => errors.body != ""}>
                            {errors.body}
                        </HelperText>

                        <TextInput
                            multiline
                            placeholder="Write something down!"
                            style={{ fontSize: 20, flexGrow: 1, backgroundColor: "transparent" }}
                            mode='outlined'
                            value={values.body}
                            onChangeText={handleChange("body")}
                            outlineColor="transparent"
                            activeOutlineColor="transparent"
                            selectionColor="#3796f3"
                        />

                        <HelperText
                            type="error"
                            visible={() => errors.body != ""}>
                            {errors.body}
                        </HelperText>

                    </ScrollView>
                </View>
            )}

        </Formik>
    );
}