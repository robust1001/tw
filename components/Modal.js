import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import Dialog from 'react-native-dialog';
import Colors from '../constants/Colors';

const Modal = ({
  visible,
  title,
  onOk,
  onCancel,
  labelOk,
  labelCancel,
  description = false,
  children,
}) => {
  return (
    <Dialog.Container visible={visible} contentStyle={styles.container}>
      <Dialog.Title
        style={{marginBottom: 30, fontSize: 20, textAlign: 'center'}}>
        {title}
      </Dialog.Title>
      {description && (
        <Dialog.Description style={{padding: 10, marginHorizontal: -20}}>
          {children}
        </Dialog.Description>
      )}
      {!description && children}
      <View>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: Colors.cancel}]}
          onPress={onCancel}>
          <Text>{labelCancel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: Colors.primary}]}
          onPress={onOk}>
          <Text>{labelOk}</Text>
        </TouchableOpacity>
      </View>
    </Dialog.Container>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginHorizontal: 50,
  },
  button: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
    alignItems: 'center',
  },
});

export default Modal;
