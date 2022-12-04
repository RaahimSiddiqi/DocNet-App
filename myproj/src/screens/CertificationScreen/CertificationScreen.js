import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React from "react";
import { Alert } from "react-native";
import { SERVER_IP, SERVER_PORT } from "../../../config";
import { CertificationForm } from "../../components/CertificationForm";
import { authContext } from '../../context';
export default CertificationScreen = () => {
    const navigation = useNavigation();
    const { auth } = React.useContext(authContext);
    const onCertify = (formData) => {
        axios.post(
            `http://${SERVER_IP}:${SERVER_PORT}/api/certify`,
            formData,
            { headers: { "authorization": `BEARER ${auth.accessToken}` }, timeout : 5000 }
        )
            .then(response => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'HomeScreen' }]
                });
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
    }
    return (
        <CertificationForm results={onCertify} />
    );
}