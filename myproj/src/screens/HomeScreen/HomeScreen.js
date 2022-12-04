import { View, Image, StyleSheet, ImageBackground, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { Text, TextInput, Button, IconButtonm , Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { themeContext } from '../../context';
import axios from 'axios';
import { SERVER_IP, SERVER_PORT } from '../../../config';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [feed, setFeed] = useState([]);
  const [isRefreshing, setIsRefresing] = useState(false);
  const {theme} = useContext(themeContext);
  const styles = createStyles(theme);
  
  useEffect(() => {
    getPostFeed();
  }, [])

  function getPostFeed() {
    axios.get(`http://${SERVER_IP}:${SERVER_PORT}/posts/getFeed`, {timeout : 5000})
    .then((response) => {
      setFeed(response.data.data);
    })
    .catch((error) => {
      if(error.response){        
        Alert.alert("Invalid request.", "Your request could not be processed. Please try again later or contact support.");
      }
      else
          Alert.alert("404", "The server is irresponsive. Please try again later or contact support.");
    })
  }


  function viewPost(postData) {
    navigation.navigate("PostView", postData)
  }

  function onRefresh() {
    getPostFeed();
  }

  const renderPost = ({item}) => {
    if (item) {
      return (
      <Card style={styles.card} key={item.itemId} onPress={() => viewPost(item)}>
        <Card.Title title={"r/" + item.category}
                    titleStyle={{...styles.heading}}
                    subtitle={"Posted by: " + item.userName + "(" + item.creationTime + ")"}
                    subtitleStyle={{...styles.text_small}}></Card.Title>
        <Card.Content>
          <Text style={{...styles.text_medium}}>{item.title}</Text>
          <Paragraph numberOfLines={3} style={{...styles.text_small}}>{item.body}</Paragraph>
        </Card.Content>
      </Card>
    
      );
    }
  }


  return (
    <>
      <View style={{ flex: 1, ...styles.root }}>
        <FlatList
          data={feed}
          renderItem={renderPost}
          keyExtractor={(item) => item.postId}
          onRefresh={onRefresh}
          refreshing={isRefreshing}      
        />
      </View>
    </>
  );
};


export default HomeScreen;


const createStyles = ({colors}) => StyleSheet.create({
  root : {
    flex:1,
    backgroundColor: "#F9F9F9"
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
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: colors.primaryContainer
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
      color: colors.tertiaryText,
      fontSize:16
  },
  text_small : {
      color: colors.tertiaryText,
      fontSize:13
  },
})


// <Card style={styles.card} key={item.itemId} onPress={() => viewPost(item)}>
// <Card.Title title={item.title}
//             titleStyle={{...styles.heading}}
//             subtitle={"Category: " + item.category}
//             subtitleStyle={{...styles.text_small}}></Card.Title>
// <Card.Content>
//   <Paragraph style={{...styles.text_medium}}>{item.body}</Paragraph>
// </Card.Content>
// </Card>