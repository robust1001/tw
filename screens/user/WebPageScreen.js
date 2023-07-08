import React from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import Header from '../../components/Header';

const WebPageScreen = props => {
  const {route} = props;
  const url = route.params.url;

  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <Header back />
      <WebView style={styles.webview} source={{uri: url}} />
    </View>
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});

export default WebPageScreen;
