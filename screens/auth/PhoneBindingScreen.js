import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {StackActions} from '@react-navigation/native';

import PhoneVerifyItem from '../../components/PhoneVerifyItem';
import Util from '../../utils/Util';
import ENV from '../../env';
import String from '../../constants/String';
import {updateUserProfile} from '../../store/features/userSlice';
import {setAuthenticate} from '../../store/features/authSlice';
import {verifyPhoneCode, weixinSignupAPI} from '../../api/user';
import {Themes} from '../../utils/Theme';
import Header from '../../components/Header';
import {setMyInfo} from '../../store/features/userSlice';

const PhoneBindingScreen = props => {
  const {route} = props;
  const [login, setMode] = useState(route.params.login);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const validateAuthForm = () => {
    if (!phoneNumber) {
      Util.showMessage(String.pleaseInputPhoneNumber);
      return false;
    }
    if (!verifyCode) {
      Util.showMessage(String.pleaseInputSMSCode);
      setIsLoading(false);
      return false;
    }
    return true;
  };

  const AuthHandler = async () => {
    if (validateAuthForm()) {
      const verf = await verifyPhoneCode(phoneNumber, verifyCode).then(
        function (obj) {
          dispatch(updateUserProfile({phone: phoneNumber}));
          const popAction = StackActions.pop(1);
          props.navigation.dispatch(popAction);
        },
        function (err) {
          Util.showMessage(String.incorrectSMSCode);
          return;
        },
      );
    }
  };

  //微信注册
  const weixinSignupHandler = async () => {
    if (validateAuthForm()) {
      try {
        setIsLoading(true);

        const resData = await weixinSignupAPI(
          phoneNumber,
          verifyCode,
          ENV.WX.nickname,
          ENV.WX.unionid,
          ENV.WX.avatarUrl,
        );
        setIsLoading(false);
        if (resData == 'incorrect_smscode') {
          Util.showMessage(String.incorrectSMSCode);
          return;
        }
        if (resData.result) {
          console.log('weixinSignup success');
          dispatch(setMyInfo(resData));
          if (resData.is_blocked == '1') {
            Alert.alert('', String.blockedUser, [{text: String.confirm}]);
            return;
          }

          if (resData.location == '/') {
            props.navigation.navigate('SelProvinceAuth', {login: true});
          } else {
            dispatch(setAuthenticate({user: ENV.userid, token: ENV.token}));
          }
        } else {
          if (resData.message == 'invalid_appid') {
            Util.showMessage(String.incorrectInfo);
          } else {
            console.log('login failed 1:', resData.message);
          }
        }
      } catch (error) {
        console.log('login failed 2:', error);
        setIsLoading(false);
        Util.showMessage(String.exception);
      }
    }
  };

  const setPhoneNumberHandler = text => {
    setPhoneNumber(text);
  };

  return (
    <View style={{flex: 1}}>
      <Header back />
      <View style={Themes.rootContainer}>
        <Text style={[Themes.title, {marginBottom: 40}]}>
          {String.phoneVerify}
        </Text>

        <PhoneVerifyItem setPhoneNumberHandler={setPhoneNumberHandler} />

        <View style={Themes.inputContainer}>
          <TextInput
            style={Themes.inputField}
            placeholder={String.pleaseInputSMSCode}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            value={verifyCode}
            onChangeText={text => setVerifyCode(text)}
          />
        </View>

        <TouchableOpacity
          style={[Themes.button]}
          onPress={login ? weixinSignupHandler : AuthHandler}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={Themes.buttonText}>
              {login ? String.login : String.confirm}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PhoneBindingScreen;
