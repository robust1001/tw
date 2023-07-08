import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useDispatch} from 'react-redux';

import PhoneVerifyItem from '../../components/PhoneVerifyItem';
import Util from '../../utils/Util';
import Colors from '../../constants/Colors';
import String from '../../constants/String';
import {setAuthenticate} from '../../store/features/authSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ENV from '../../env';
import {pswdLoginAPI, pswdSignupAPI} from '../../api/user';
import {Themes} from '../../utils/Theme';
import Header from '../../components/Header';
import {setMyInfo} from '../../store/features/userSlice';

const PswdLoginScreen = props => {
  const [isSignup, setIsSignUp] = useState(false);
  const [showPswd, setShowPswd] = useState(false);
  const [userid, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verifyCode, setVerifyCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const validateAuthForm = () => {
    const passwordRegex = /\d/;
    if (isSignup && !phoneNumber) {
      Util.showMessage('请输入电话号码。');
      setIsLoading(false);
      return false;
    }
    if (isSignup && !verifyCode) {
      Util.showMessage('请输入验证码。');
      setIsLoading(false);
      return false;
    }
    if (!isSignup && !userid) {
      Util.showMessage('请输入用户名。');
      setIsLoading(false);
      return false;
    }
    if (!isSignup && userid && userid.length < 2) {
      Util.showMessage('用户名不正确。');
      setIsLoading(false);
      return false;
    }
    if (!password || password.length === 0) {
      Util.showMessage('请输入密码。');
      setIsLoading(false);
      return false;
    }
    if (!password || password.length === 0) {
      Util.showMessage('请确认密码。');
      setIsLoading(false);
      return false;
    }
    if (password.length < 6 || password.length > 16) {
      Util.showMessage('密码必须6-16字符。');
      setIsLoading(false);
      return false;
    }
    if (!passwordRegex.test(password)) {
      Util.showMessage('密码必须包括一个字以上的数字。');
      setIsLoading(false);
      return false;
    }
    return true;
  };

  const AuthHandler = async () => {
    if (validateAuthForm()) {
      if (isSignup) {
        try {
          setIsLoading(true);
          const resData = await pswdSignupAPI(
            phoneNumber,
            verifyCode,
            password,
          );
          setIsLoading(false);
          if (resData == 'incorrect_smscode') {
            Util.showMessage(String.incorrectSMSCode);
            return;
          }
          if (resData.result) {
            Util.showMessage(String.sineupUserSuccess);
            setIsSignUp(false);
            setPhoneNumber('');
            setVerifyCode('');
            setPassword('');
          } else {
            if (resData.message == 'user_already_registered') {
              Util.showMessage(String.alreadyExistUser);
            } else {
              console.log('login failed 1:', resData.message);
            }
          }
        } catch (error) {
          console.log('login failed 2:', error);
          setIsLoading(false);
          Util.showMessage(String.exception);
        }
      } else {
        let resData;
        try {
          setIsLoading(true);
          resData = await pswdLoginAPI(userid, password);
          console.log('pswdLogin success:', JSON.stringify(resData, null, 2));
          setIsLoading(false);

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
            console.log('login failed 1:', resData);
            if (resData.message == 'invalid_appid') {
              Util.showMessage(String.incorrectInfo);
            } else if (resData.message == 'user_not_registered') {
              Util.showMessage(String.noUser);
            } else if (resData.message == 'incorrect_password') {
              Util.showMessage(String.incorrectPswd);
            }
          }
        } catch (error) {
          setIsLoading(false);
          console.log('signin fail:', error);
          Util.showMessage(String.exception);
        }
      }
    }
  };

  const inputChangeHandler = (text, inputField) => {
    if (inputField === 1) {
      if (isSignup) setVerifyCode(text);
      else setUserID(text);
    } else if (inputField === 2) {
      setPassword(text);
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
          {isSignup ? String.pswdSignUp : String.pswdLogIn}
        </Text>
        {isSignup && (
          <PhoneVerifyItem setPhoneNumberHandler={setPhoneNumberHandler} />
        )}
        <View style={Themes.inputContainer}>
          <TextInput
            style={Themes.inputField}
            placeholder={
              isSignup
                ? String.pleaseInputSMSCode
                : String.pleaseInputTWcodeOrPhoneNumber
            }
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            value={isSignup ? verifyCode : userid}
            onChangeText={text => inputChangeHandler(text, 1)}
          />
        </View>

        <View style={Themes.inputContainer}>
          <TextInput
            style={Themes.inputField}
            placeholder={String.pswdLength}
            secureTextEntry={password.length == 0 ? true : !showPswd}
            underlineColorAndroid="transparent"
            value={password}
            autoCapitalize="none"
            onChangeText={text => inputChangeHandler(text, 2)}
          />
          <TouchableOpacity
            onPress={() => {
              setShowPswd(!showPswd);
            }}>
            <Ionicons
              style={styles.icon}
              name="eye"
              size={20}
              color={showPswd ? 'red' : 'gray'}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[Themes.button]} onPress={AuthHandler}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={Themes.buttonText}>
              {isSignup ? String.signup : String.login}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsSignUp(prevState => !prevState);
          }}>
          <Text style={{color: Colors.textColor}}>
            {isSignup ? String.pswdLogin : String.pswdSignup}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 15,
  },
});

export default PswdLoginScreen;
