import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Themes} from '../utils/Theme';

const WechatShare = ({share}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.item} onPress={() => share(0)}>
        <Image
          style={styles.wechat}
          source={require('../assets/wechat_message.png')}
        />
        <Text style={Themes.text}>{String.weixinShare}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => share(1)}>
        <Image
          style={styles.wechat}
          source={require('../assets/wechat_share.png')}
        />
        <Text style={Themes.text}>{String.weixinMonentum}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
  },
  item: {
    alignItems: 'center',
  },
  wechat: {
    width: 40,
    height: undefined,
    aspectRatio: 1,
  },
});

export default WechatShare;
