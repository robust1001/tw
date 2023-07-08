import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import Colors from '../constants/Colors';

const InputItem = props => {
  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>{props.title}</Text>
      <TextInput
        style={[{minHeight: props.lines * 25}]}
        multiline
        onChangeText={text => props.onChangeText(text)}
        placeholder={props.placeholder}
        editable
        value={props.value}
        numberOfLines={props.lines}
        maxLength={200}
        autoCapitalize="none"
        textAlignVertical={'top'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    marginTop: 10,
    borderRadius: 5,
    padding: 6,
  },
  title: {
    fontSize: 16,
    color: Colors.textColor,
  },
});

export default InputItem;
