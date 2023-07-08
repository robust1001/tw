import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import DatePicker from 'react-native-date-picker';

import SettingItem from '../../components/SettingItem';
import Util from '../../utils/Util';
import ENV from '../../env';
import Colors from '../../constants/Colors';
import String from '../../constants/String';
import {
  setUserProfile,
  updateUserProfile,
} from '../../store/features/userSlice';
import {logout} from '../../store/features/authSlice';
import {delUserAPI} from '../../api/user';
import Header from '../../components/Header';
import TakePic from '../../components/TakePic';

const AccountScreen = props => {
  const refRBSheetImage = useRef();
  const refRBSheetGender = useRef();
  const refRBSheetBirthday = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(Util.nowTime());

  const dispatch = useDispatch();
  const location = useSelector(state => state.user.location);
  const logo = useSelector(state => state.user.logo);
  const phone = useSelector(state => state.user.phone);
  const gender = useSelector(state => state.user.gender);
  const birthday = useSelector(state => state.user.birthday);
  const job = useSelector(state => state.user.job);
  const pos = useSelector(state => state.user.pos);
  const twid = useSelector(state => state.user.twid);
  const nickname = useSelector(state => state.user.nickname);

  if (isLoading) {
    return (
      <View style={styles}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const logOut = async () => {
    Util.removeStorageItem('userStorageData');
    dispatch(logout());
  };

  const delUser = async () => {
    Alert.alert('', String.areYouSureDeleteAccount, [
      {
        text: String.cancel,
        style: 'cancel',
      },
      {
        text: String.confirm,
        onPress: async () => {
          await delUserAPI();
          Util.removeStorageItem('userStorageData');
          dispatch(logout());
        },
      },
    ]);
  };

  const updateAvatar = async url => {
    dispatch(updateUserProfile({logo: url}));
  };

  const updateImage = imagePath => {
    Util.uploadImage(imagePath)
      .then(res => {
        const resData = res.json();
        updateAvatar(resData.url);
      })
      .catch(error => {
        console.log('image upload error: ', error);
      });
  };

  const takePicture = async mode => {
    refRBSheetImage.current.close();
    Util.takeImage(mode)
      .then(image => {
        updateImage(image.path);
      })
      .catch(err => {
        console.log('no image');
      });
  };

  const takeGender = async mode => {
    refRBSheetGender.current.close();
    dispatch(updateUserProfile({gender: mode == 0 ? '1' : '0'}));
  };

  const handler = mode => {
    if (mode == 0) {
      props.navigation.navigate('Nickname', {value: nickname});
    } else if (mode == 2) {
      props.navigation.navigate('PhoneBinding', {login: false});
    } else if (mode == 3) {
      props.navigation.navigate('SetPswd');
    } else if (mode == 4) {
      props.navigation.navigate('SelProvince', {login: false});
    } else if (mode == 5) {
      refRBSheetBirthday.current.close();
      dispatch(
        updateUserProfile({
          birthday: `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`,
        }),
      );
    } else if (mode == 7) {
      props.navigation.navigate('Job');
    } else if (mode == 8) {
      props.navigation.navigate('Pos');
    }
  };

  return (
    <View>
      <Header back />
      <ScrollView>
        <View>
          <SettingItem
            text={String.avatar}
            source={Util.getThumbImage(logo, true)}
            onPress={() => refRBSheetImage.current.open()}
          />
          <RBSheet
            ref={refRBSheetImage}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
              draggableIcon: {
                backgroundColor: Colors.black,
              },
            }}>
            <TakePic handler={mode => takePicture(mode)} />
          </RBSheet>
          <SettingItem
            text={String.nickname}
            text2={nickname}
            onPress={() => handler(0)}
          />
          <SettingItem text={String.tengweiCode} text2={twid} noExpand />
          <SettingItem
            text={String.boundingPhone}
            text2={phone}
            onPress={() => handler(2)}
          />
          <SettingItem text={String.setPswd} onPress={() => handler(3)} />
          <SettingItem
            text={String.gender}
            text2={
              gender != '' ? (gender == '1' ? String.man : String.women) : ''
            }
            onPress={() => refRBSheetGender.current.open()}
          />
          <RBSheet
            ref={refRBSheetGender}
            closeOnDragDown={true}
            closeOnPressMask={true}
            height={160}
            customStyles={{
              draggableIcon: {
                backgroundColor: Colors.black,
              },
            }}>
            <View style={styles.listContainer}>
              <TouchableOpacity
                style={[styles.buttonContainer]}
                onPress={() => takeGender(0)}>
                <Text>{String.man}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonContainer]}
                onPress={() => takeGender(1)}>
                <Text>{String.women}</Text>
              </TouchableOpacity>
            </View>
          </RBSheet>
          <SettingItem
            text={String.birthday}
            text2={birthday !== '0000-00-00' ? birthday : ''}
            onPress={() => refRBSheetBirthday.current.open()}
          />
          <RBSheet
            ref={refRBSheetBirthday}
            closeOnDragDown={true}
            closeOnPressMask={true}
            height={240}
            customStyles={{
              draggableIcon: {
                backgroundColor: Colors.black,
              },
            }}>
            <TouchableOpacity onPress={() => handler(5)}>
              <Text style={styles.listLabel1}>{String.confirm}</Text>
            </TouchableOpacity>
            <View style={{alignItems: 'center'}}>
              <DatePicker
                date={date}
                locale="zh"
                onDateChange={setDate}
                mode="date"
              />
            </View>
          </RBSheet>
          <SettingItem
            text={String.job}
            text2={job}
            onPress={() => handler(7)}
          />
          <SettingItem
            text={String.pos}
            text2={pos}
            onPress={() => handler(8)}
          />
          <SettingItem
            text={String.location}
            text2={location}
            onPress={() => handler(4)}
          />
        </View>

        <View>
          {/* <SettingItem
          text={String.deleteAccount}
          textCenter
          noExpand
          onPress={() => delUser()}
        /> */}
          <SettingItem
            text={String.logout}
            textCenter
            noExpand
            onPress={() => logOut()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  listLabel1: {
    marginLeft: 'auto',
    marginRight: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default AccountScreen;
