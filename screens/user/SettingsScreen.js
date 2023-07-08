import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  Linking,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';

import SettingItem from '../../components/SettingItem';
import Weixin from '../../utils/Weixin';
import Util from '../../utils/Util';
import ENV from '../../env';
import Colors from '../../constants/Colors';
import String from '../../constants/String';
import {Themes} from '../../utils/Theme';
import Header from '../../components/Header';
import WechatShare from '../../components/WechatShare';

const SettingsScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const refRBSheet = useRef();
  const noread_count = useSelector(state => state.chat.noread_count);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const share = async mode => {
    refRBSheet.current.close();
    if (mode == 0) {
      await Weixin.wxShareToSessionHandler(
        String.shareAppTitle,
        String.shareAppContent,
        'https://i.loli.net/2019/09/03/62FauzAY37gsEXV.png',
        'news',
        'https://tengweitech.com/',
      );
    } else if (mode == 1) {
      await Weixin.wxShareToMomentHandler(
        String.shareAppTitle,
        String.shareAppContent,
        'https://i.loli.net/2019/09/03/62FauzAY37gsEXV.png',
        'news',
        'https://tengweitech.com/',
      );
    }
  };

  const ShowDownloadPage = () => {
    Linking.openURL(ENV.urlDownload);
  };

  const handler = mode => {
    if (mode == 0) {
      props.navigation.navigate('Account');
    } else if (mode == 1) {
      props.navigation.navigate('VIP');
    } else if (mode == 3) {
      props.navigation.navigate('FeedBack', {type: 'app_report'});
    } else if (mode == 4) {
      if (ENV.version == ENV.server_version) {
        Util.showMessage(String.isNewestVersion);
      } else {
        Alert.alert('', String.areYouSureUpdate, [
          {
            text: String.cancel,
            style: 'cancel',
          },
          {
            text: String.confirm,
            onPress: () => ShowDownloadPage(),
          },
        ]);
      }
    } else if (mode == 5) {
      props.navigation.navigate('About');
    } else if (mode == 6) {
      // props.navigation.navigate('Notification');
      props.navigation.navigate('Chatting', {
        userid: 0,
        username: 'tw_admin',
      });
    }
  };

  const getNotifBadgeCount = () => {
    return noread_count;
  };

  return (
    <View>
      <Header back />
      <SettingItem
        text={String.accountAndSecurity}
        onPress={() => handler(0)}
      />
      <SettingItem
        text={String.notification}
        badge={getNotifBadgeCount()}
        onPress={() => handler(6)}
      />
      {ENV.vipMode && (
        <SettingItem text={String.vipInfo} onPress={() => handler(1)} />
      )}
      <SettingItem
        text={String.share}
        onPress={() => refRBSheet.current.open()}
      />
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={160}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <WechatShare share={mode => share(mode)} />
      </RBSheet>
      <SettingItem text={String.appReport} onPress={() => handler(3)} />
      <SettingItem
        text={String.checkVersion}
        text2={`${String.version1} ${ENV.version}`}
        onPress={() => handler(4)}
      />
      <SettingItem text={String.aboutTengwei} onPress={() => handler(5)} />
    </View>
  );
};

export default SettingsScreen;
