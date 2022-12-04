import { View, Image, StyleSheet, ImageBackground, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


const HomeScreen = () => {
  const navigation = useNavigation();


  return (
    <>
      <View style={{ flex: 1 }}>
        <ScrollView>
          {Array.from({ length: 20 }, (item, i) => <Text key={i} style={{ marginVertical: 10 }}>Hi {i}</Text>)}
        </ScrollView>
      </View>
    </>
  );
};


export default HomeScreen;
