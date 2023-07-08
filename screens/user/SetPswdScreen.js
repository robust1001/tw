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

import Colors from '../../constants/Colors';
import Util from '../../utils/Util';
import String from '../../constants/String';
import {updateUserProfile} from '../../store/features/userSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Themes} from '../../utils/Theme';
import Header from '../../components/Header';

const SetPswdScreen = props => {
  const [showPswd, setShowPswd] = useState(false);
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const validateAuthForm = () => {
    const passwordRegex = /\d/;
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
      dispatch(updateUserProfile({password: password}));
      const popAction = StackActions.pop(1);
      props.navigation.dispatch(popAction);
    }
  };

  const inputChangeHandler = (text, inputField) => {
    setPassword(text);
  };

  return (
    <View style={{flex: 1}}>
      <Header back />
      <View style={Themes.rootContainer}>
        <Text style={[Themes.title, {marginBottom: 40}]}>{String.setPswd}</Text>
        <View style={Themes.inputContainer}>
          <TextInput
            style={Themes.inputField}
            placeholder={String.pleaseInputNewPswd}
            secureTextEntry={password.length == 0 ? true : !showPswd}
            underlineColorAndroid="transparent"
            value={password}
            autoCapitalize="none"
            onChangeText={text => inputChangeHandler(text)}
          />
          <TouchableOpacity
            onPress={() => {
              setShowPswd(!showPswd);
            }}>
            <Ionicons name="eye" size={20} color={showPswd ? 'red' : 'gray'} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={Themes.button} onPress={AuthHandler}>
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={Themes.buttonText}>{String.confirm}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SetPswdScreen;
