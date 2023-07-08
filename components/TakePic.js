import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Themes} from '../utils/Theme';
import Colors from '../constants/Colors';
import String from '../constants/String';

const TakePic = ({handler}) => {
  return (
    <View style={styles.listContainer}>
      <TouchableOpacity style={[Themes.button]} onPress={() => handler(0)}>
        <Text>{String.takePicture}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[Themes.button]} onPress={() => handler(1)}>
        <Text>{String.selectFromAlbum}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[Themes.button, {backgroundColor: Colors.cancel}]}
        onPress={() => handler(2)}>
        <Text>{String.cancel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    alignItems: 'center',
    paddingHorizontal: 25,
  },
});

export default TakePic;
