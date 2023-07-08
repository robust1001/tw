import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {StackActions} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Util from '../../utils/Util';
import Colors from '../../constants/Colors';
import String from '../../constants/String';
import {updateUserProfile} from '../../store/features/userSlice';
import {Themes} from '../../utils/Theme';
import Header from '../../components/Header';

const NicknameScreen = props => {
  const dispatch = useDispatch();
  const {route} = props;
  const [nickname, setNickname] = useState(route.params.value);

  const validateAuthForm = () => {
    if (nickname == '') {
      Util.showMessage(String.pleaseInputNickname);
      return false;
    }
    return true;
  };

  const SaveHandler = async () => {
    if (validateAuthForm()) {
      dispatch(updateUserProfile({nickname: nickname}));
      const popAction = StackActions.pop(1);
      props.navigation.dispatch(popAction);
    }
  };

  return (
    <View>
      <Header back />
      <View style={styles.container}>
        <View style={styles.body}>
          <Text style={styles.title}>{String.nickname}:</Text>
          <TextInput
            style={styles.inputs}
            value={nickname}
            underlineColorAndroid="transparent"
            maxLength={20}
            autoCapitalize="none"
            onChangeText={text => setNickname(text)}
          />
          <TouchableOpacity
            onPress={() => {
              setNickname('');
            }}>
            <Ionicons
              style={{color: Colors.textColor}}
              name="close-circle-sharp"
              size={16}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.comment}>{String.nicknameLength}</Text>
        <TouchableOpacity style={Themes.button} onPress={SaveHandler}>
          <Text style={{color: Colors.white}}>{String.sendReport}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  body: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontWeight: '300',
    color: Colors.textColor,
    fontSize: 16,
    textAlignVertical: 'center',
  },
  inputs: {
    flex: 1,
    color: Colors.textColor,
  },
  comment: {
    marginTop: 10,
    color: Colors.textColor,
    textAlign: 'center',
    fontSize: 12,
  },
});

export default NicknameScreen;
