import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useDispatch} from 'react-redux';

import PhoneVerifyItem from '../../components/PhoneVerifyItem';
import Util from '../../utils/Util';
import String from '../../constants/String';
import {setAuthenticate} from '../../store/features/authSlice';
import ENV from '../../env';
import {phoneLoginAPI} from '../../api/user';
import {Themes} from '../../utils/Theme';
import Header from '../../components/Header';
import {setMyInfo} from '../../store/features/userSlice';

const PhoneLoginScreen = props => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const validateAuthForm = () => {
    if (!phoneNumber) {
      Util.showMessage(String.pleaseInputPhoneNumber);
      setIsLoading(false);
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
      try {
        setIsLoading(true);
        const resData = await phoneLoginAPI(phoneNumber, verifyCode);
        console.log('phoneLoginAPI:', JSON.stringify(resData, null, 2));
        setIsLoading(false);
        if (resData == 'incorrect_smscode') {
          Util.showMessage(String.incorrectSMSCode);
          return;
        }
        if (resData.result) {
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
          {String.phoneLogin}
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

        <TouchableOpacity style={[Themes.button]} onPress={AuthHandler}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={Themes.buttonText}>{String.login}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PhoneLoginScreen;
