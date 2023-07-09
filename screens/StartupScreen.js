import React, {useEffect} from 'react';
import {
  View,
  ActivityIndicator,
  Image,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import {useDispatch} from 'react-redux';
import DeviceInfo, {
  useDeviceName,
  useManufacturer,
} from 'react-native-device-info';
const IMEI = require('react-native-imei');

import Weixin from '../utils/Weixin';
import Colors from '../constants/Colors';
import ENV from '../env';
import String from '../constants/String';
import {setAuthenticate, setDidTryAutoLogin} from '../store/features/authSlice';
import Util from '../utils/Util';
import {getMyInfoAPI} from '../api/user';
import {setMyInfo} from '../store/features/userSlice';

const StartupScreen = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    const GetDeviceInfo = async () => {
      try {
        let deviceId = DeviceInfo.getDeviceId(); //android, ios
        let deviceName = await DeviceInfo.getDeviceName(); //android, ios
        let macAddress = await DeviceInfo.getMacAddress(); //android, ios
        let model = DeviceInfo.getModel(); //android, ios
        let serial = '';
        if (Platform.OS === 'android') {
          serial = await DeviceInfo.getSerialNumber(); //android
        }
        let uniqueId = DeviceInfo.getUniqueId(); //android, ios
        let imei = '';
        if (Platform.OS === 'android') {
          // imei = await IMEI.getImei(); //android
        }

        ENV.DEV_INFO.imei = imei; //['353767082212157']
        ENV.DEV_INFO.mac = macAddress; //14:1F:78:8B:1C:90, 02:00:00:00:00:00
        ENV.DEV_INFO.model = model; //SM-G5520, iPhone X
        ENV.DEV_INFO.deviceName = deviceName; //Galaxy On5 2016 时尚版, iPhoneX
        ENV.DEV_INFO.serialNumber = serial; //1c70ec17
        ENV.DEV_INFO.deviceId = deviceId; //msm8937, iPhone10,3
        ENV.DEV_INFO.uniqueId = uniqueId; //b4e4eed788e4e44a, 85AC4C76-DF85-4C58-89C3-384535B120A8
        console.log(JSON.stringify(ENV.DEV_INFO, null, 2));
      } catch (error) {
        console.log('error: ', error);
      }
    };

    const getSettingValue = (settings, comment) => {
      for (i = 0; i < settings.length; i++) {
        if (settings[i].comment == comment) {
          console.log(comment + ' : ' + settings[i].value);
          return settings[i].value;
        }
      }
    };

    const init = async () => {
      let url = `${ENV.mainUrl}/api/user/getsetting`;
      console.log('url: ', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const resData = await response.json();
      // console.log('resData: ', JSON.stringify(resData, null, 2));
      if (resData.result) {
        ENV.urlDownload = getSettingValue(resData.settings, 'url_download');
        ENV.urlPrivacy = getSettingValue(resData.settings, 'url_privacy');
        ENV.urlAgreement = getSettingValue(resData.settings, 'url_agreement');
        ENV.urlCompany = getSettingValue(resData.settings, 'url_company');
        ENV.urlPayAgree = getSettingValue(resData.settings, 'url_payAgree');

        ENV.money_first = getSettingValue(resData.settings, 'money_first');
        ENV.money_month = getSettingValue(resData.settings, 'money_month');
        ENV.money_year = getSettingValue(resData.settings, 'money_year');

        ENV.server_version = getSettingValue(resData.settings, 'version');
        ENV.incomp_version = getSettingValue(
          resData.settings,
          'incomp_version',
        );

        ENV.urlBackend = getSettingValue(resData.settings, 'url_backend');
        ENV.urlChat = getSettingValue(resData.settings, 'url_chat');
        ENV.urlWeb = getSettingValue(resData.settings, 'url_web');
        ENV.urlAPI = ENV.urlBackend + '/api';

        ENV.last_notif_id = getSettingValue(resData.settings, 'last_notif_id');
        ENV.maintain = getSettingValue(resData.settings, 'maintain');

        ENV.BMOB.APPID = resData.a;
        ENV.BMOB.REST_APIKEY = resData.b;

        ENV.WX.APPID = resData.c;
        ENV.WX.MERCHANT_ID = resData.g;

        Weixin.wxRegisterApp(resData.c, resData.i);

        if (ENV.version <= ENV.incomp_version) {
          //必须要更新
          Alert.alert('', String.areYouSureUpdate, [
            {
              text: String.confirm,
              onPress: () => ShowDownloadPage(),
            },
          ]);
        } else if (ENV.version < ENV.server_version) {
          Alert.alert('', String.areYouSureUpdate, [
            {
              text: String.cancel,
              onPress: () => authenticate(),
              style: 'cancel',
            },
            {
              text: String.confirm,
              onPress: () => ShowDownloadPage(),
            },
          ]);
        } else {
          authenticate();
        }
      }
    };

    GetDeviceInfo();
    init();
  }, []);

  const authenticate = async () => {
    const data = await Util.getStorageItem('userStorageData');
    const USER = JSON.parse(data);
    console.log('USER:', JSON.stringify(USER, null, 2));
    if (!USER) {
      dispatch(setDidTryAutoLogin()); //没有以前登陆过的信息
    } else {
      const resData = await getMyInfoAPI(USER.userid, USER.token);
      console.log('resData', JSON.stringify(resData, null, 2));
      if (resData.result) {
        dispatch(setMyInfo(resData));
        dispatch(setAuthenticate({user: USER.userid, token: USER.token})); //有以前登陆过的信息，所以直接登陆
      }
    }
  };

  const ShowDownloadPage = () => {
    Linking.openURL(ENV.urlDownload);
  };

  return (
    <View style={styles.screen}>
      <Image style={styles.bgImage} source={require('../assets/bg.png')} />
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImage: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
});

export default StartupScreen;
