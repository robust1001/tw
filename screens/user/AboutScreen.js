import React from 'react';
import {View, StyleSheet, Image, Text, Linking} from 'react-native';

import SettingItem from '../../components/SettingItem';
import ENV from '../../env';
import Colors from '../../constants/Colors';
import String from '../../constants/String';
import Header from '../../components/Header';

const AboutScreen = props => {
  const handler = mode => {
    if (mode == 0) {
      props.navigation.navigate('WebPage', {url: ENV.urlAgreement});
    } else if (mode == 1) {
      props.navigation.navigate('WebPage', {url: ENV.urlPrivacy});
    } else if (mode == 2) {
      Linking.openURL(ENV.urlDownload);
    }
  };

  return (
    <View>
      <Header back />
      <View style={styles.body}>
        <Image
          style={styles.bgImage}
          source={require('../../assets/logo-title.png')}
        />
        <Text style={styles.btnVersion}>
          {String.version} {ENV.version}
        </Text>
      </View>
      <SettingItem text={String.companySite} onPress={() => handler(2)} />
      <SettingItem text={String.agreement} onPress={() => handler(0)} />
      <SettingItem text={String.privacyPolicy} onPress={() => handler(1)} />
      <View style={{marginBottom: 120}}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    marginVertical: 40,
    alignItems: 'center',
  },
  bgImage: {
    width: 200,
    height: 65,
  },
  btnVersion: {
    color: Colors.textColor,
    marginTop: 10,
  },
});

export default AboutScreen;
