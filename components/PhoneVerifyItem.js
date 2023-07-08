import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import ENV from '../env';
import Colors from '../constants/Colors';
import Util from '../utils/Util';
import String from '../constants/String';
import {Bmob} from '../bmob/bmob';
import {Themes} from '../utils/Theme';

const PhoneVerifyItem = props => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [seconds, setSeconds] = useState(60);
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (timerStarted) {
      if (seconds > 0) {
        setTimeout(() => {
          mounted && setSeconds(seconds - 1);
        }, 1000);
      } else {
        mounted && setTimerStarted(false);
      }
    }

    return () => (mounted = false);
  }, [seconds, timerStarted]);

  useEffect(() => {
    Bmob.initialize(ENV.BMOB.APPID, ENV.BMOB.REST_APIKEY);
  }, []);

  const SMSHandler = async () => {
    console.log('SMSHandler:', phoneNumber);
    Bmob.Sms.requestSmsCode({mobilePhoneNumber: phoneNumber}).then(
      function (obj) {},
      function (err) {
        console.log('Send SMS code failed: ' + err);
      },
    );
  };

  const countDown = () => {
    if (phoneNumber == '') {
      Util.showMessage(String.pleaseInputPhoneNumber);
      return;
    }
    SMSHandler();
    setTimerStarted(true);
  };

  const inputChangeHandler = text => {
    setPhoneNumber(text);
    props.setPhoneNumberHandler(text);
  };

  return (
    <View style={Themes.inputContainer}>
      <Text style={{color: Colors.textColor}}>+86</Text>
      <TextInput
        style={Themes.inputField}
        placeholder={String.pleaseInputPhoneNumber}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        value={phoneNumber}
        onChangeText={text => inputChangeHandler(text)}
      />
      {timerStarted ? (
        <Text style={styles.getcode}>
          {Util.strFormat(String.resendAfterXSeconds, seconds)}
        </Text>
      ) : (
        <TouchableOpacity onPress={countDown}>
          <Text style={styles.getcode}>{String.getSMSCode}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  getcode: {
    width: 84,
    marginRight: 4,
    color: Colors.textColor,
    borderColor: Colors.textColor,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 5,
    textAlign: 'center',
  },
});

export default PhoneVerifyItem;
