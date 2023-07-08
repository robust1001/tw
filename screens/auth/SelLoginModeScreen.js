import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {useDispatch} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
// import Dialog from 'react-native-dialog';

import Modal from '../../components/Modal';
import Weixin from '../../utils/Weixin';
import ENV from '../../env';
import Colors from '../../constants/Colors';
import String from '../../constants/String';
import Util from '../../utils/Util';
import {setAuthenticate} from '../../store/features/authSlice';
import {Themes} from '../../utils/Theme';
import {setMyInfo} from '../../store/features/userSlice';

const SelLoginModeScreen = props => {
  const [wxInstalled, setWXInstalled] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showAgree, setShowAgree] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      setWXInstalled(await Weixin.isWXAppInstalled());
      //setWXInstalled(true);
      const agree1 = await Util.getStorageItem('AgreeXieyi');
      setAgree(agree1 === 'true');
      if (!agree) setShowAgree(true);
    }

    fetchData();
  }, []);

  const wxLoginHandler = async () => {
    setSpinner(true);

    let resData = await Weixin.wxLoginHandler();
    if (resData.result) {
      dispatch(setMyInfo(resData));
      if (resData.is_blocked == '1') {
        Alert.alert('', String.blockedUser, [{text: String.confirm}]);
        return;
      }
      setSpinner(false);

      if (resData.location == '/') {
        props.navigation.navigate('SelProvinceAuth', {login: true});
      } else {
        dispatch(setAuthenticate({user: ENV.userid, token: ENV.token}));
      }
    } else if (resData.error == 'user_not_registered') {
      //以前没登陆过，所以需要注册.
      setSpinner(false);
      props.navigation.navigate('PhoneBindingAuth', {login: true});
    } else if (resData.error == 'invalid_appid') {
      Util.showMessage(String.incorrectInfo);
    } else {
      console.log('login failed 1:', resData.error);
    }
  };

  const AgreeHandler = async index => {
    if (index == 0) {
      setAgree(false);
      setShowAgree(false);
    } else if (index == 1) {
      setAgree(true);
      await Util.setStorageItem('AgreeXieyi', 'true');
      setShowAgree(false);
    }
  };

  const ButtonHandler = index => {
    if (!agree) {
      setShowAgree(true);
      return;
    }
    if (index == 0) {
      wxLoginHandler();
    } else if (index == 1) {
      props.navigation.navigate('PhoneLoginAuth');
    } else if (index == 2) {
      props.navigation.navigate('PswdLoginAuth');
    }
  };

  return (
    <>
      <Spinner visible={spinner} overlayColor="#00000090" />
      <View style={Themes.rootContainer}>
        <Text style={[Themes.title, {marginBottom: 40}]}>
          {String.welcomeTengwei}
        </Text>
        {wxInstalled && (
          <TouchableOpacity
            style={[Themes.button, {backgroundColor: 'mediumseagreen'}]}
            onPress={() => ButtonHandler(0)}>
            <Text style={Themes.buttonText}>{String.weixinLogin}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[Themes.button]}
          onPress={() => ButtonHandler(1)}>
          <Text style={Themes.buttonText}>{String.phoneLogin}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[Themes.button, {backgroundColor: 'mediumpurple'}]}
          onPress={() => ButtonHandler(2)}>
          <Text style={Themes.buttonText}>{String.pswdLoginSpace}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.lblCompany}
          onPress={() => Linking.openURL(ENV.urlDownload)}>
          <Text style={Themes.text}>{String.companyName}</Text>
        </TouchableOpacity>
        <View>
          <Text style={Themes.text}>{ENV.version}</Text>
        </View>
      </View>
      <Modal
        visible={!agree && showAgree}
        //visible={true}
        title={String.agreeTitle}
        labelOk={String.agree}
        labelCancel={String.noagree}
        onOk={() => AgreeHandler(1)}
        onCancel={() => AgreeHandler(0)}
        description>
        <Text style={styles.text}>{String.agreeText2}</Text>
        <Text
          style={[styles.text, {color: Colors.hypelink}]}
          onPress={() => Linking.openURL(ENV.urlAgreement)}>
          {String.agreeText3}
        </Text>
        <Text style={styles.text}>{String.agreeText4}</Text>
        <Text
          style={[styles.text, {color: Colors.hypelink}]}
          onPress={() => Linking.openURL(ENV.urlPrivacy)}>
          {String.agreeText5}
        </Text>
        <Text style={styles.text}>{String.agreeText6}</Text>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  lblCompany: {
    marginTop: 30,
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    color: Colors.textColor,
    lineHeight: 24,
  },
});

export default SelLoginModeScreen;
