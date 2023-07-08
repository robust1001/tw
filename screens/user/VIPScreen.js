import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SliderBox} from 'react-native-image-slider-box';

import Weixin from '../../utils/Weixin';
import PayItem from '../../components/PayItem';
import Util from '../../utils/Util';
import ENV from '../../env';
import Colors from '../../constants/Colors';
import String from '../../constants/String';
import {setUserProfile} from '../../store/features/userSlice';
import Header from '../../components/Header';
import {Themes} from '../../utils/Theme';

const VIPScreen = props => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [payMode, setPayMode] = React.useState(0);

  const [moneyFirst, setMoneyFirst] = useState(0);
  const [moneyMonth, setMoneyMonth] = useState(0);
  const [moneyYear, setMoneyYear] = useState(0);

  const expire_date = useSelector(state => state.user.expire_date);
  const [expDate, setExpDate] = useState(Util.changeDateFormat(expire_date));
  const [isKaiguo, setIsKaiguo] = useState(Util.isKaiguo(expire_date));
  const vip = Util.isVIP(expire_date);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      if (isMounted) {
        setMoneyFirst(ENV.money_first);
        setMoneyMonth(ENV.money_month);
        setMoneyYear(ENV.money_year);
      }
    };
    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const getAmount = mode => {
    let s;
    if (mode == 0) {
      s = moneyFirst;
    } else if (mode == 1) {
      s = moneyMonth;
    } else if (mode == 2) {
      s = moneyYear;
    }
    return s;
  };

  const afterPayHandler = async mode => {
    const amount = getAmount(mode);
    const response = await fetch(`${ENV.urlAPI}/subscription/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: ENV.userid,
        platform: 'android',
        type: mode,
        amount: amount,
        token: ENV.token,
      }),
    });

    const resData = await response.json();
    if (!resData.result) {
      console.log('get prepay id error');
    } else {
      Util.showMessage(String.paySuccess);
      setExpDate(Util.changeDateFormat(expire_date));
      dispatch(
        setUserProfile({key: 'expire_date', value: resData.expire_date}),
      );
    }
  };

  const payHandler = async () => {
    if (Platform.OS === 'android') {
      if (payMode == 0) {
        Weixin.wxXufeiHandler(moneyFirst, moneyMonth)
          .then(requestJson => {
            console.log('pay success');
            //支付成功回调
          })
          .catch(err => {
            console.log('pay failed1');
            Util.showMessage(String.payFailed);
          });
      } else if (payMode == 1 || payMode == 2) {
        Weixin.wxPayHandler(payMode == 1 ? moneyMonth : moneyYear)
          .then(requestJson => {
            console.log('pay success');
            //支付成功回调
            if (requestJson.errCode == '0') {
              //回调成功处理
              afterPayHandler(payMode);
            }
          })
          .catch(err => {
            console.log('pay failed2');
            Util.showMessage(String.payFailed);
          });
      }
    } else {
    }
  };

  return (
    <>
      <Header back />
      {vip ? (
        <Text style={styles.endDate}>
          {String.vipExpireDate}
          {expDate}
        </Text>
      ) : isKaiguo ? (
        <Text style={styles.endDate}>{String.vipExpired}</Text>
      ) : (
        <Text style={styles.endDate}>{String.vipMeiKaitong}</Text>
      )}
      <Text style={styles.vipTequan}>{String.vipTequan}</Text>
      <View>
        <SliderBox
          images={[
            require('../../assets/slider.png'),
            require('../../assets/slider.png'),
            require('../../assets/slider.png'),
            require('../../assets/slider.png'),
          ]}
          sliderBoxHeight={120}
          autoplay
          circleLoop
          imageLoadingColor="#ffffff00"
          ImageComponentStyle={{borderRadius: 15, width: '70%', marginTop: 5}}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.body}>
          <PayItem
            title={String.payXufei}
            money={moneyFirst}
            tuijian
            dur={`/${String.firstMonth}`}
            comment={Util.strFormat(String.payXufeiComment, moneyMonth)}
            sel={payMode == 0}
            onPress={() => setPayMode(0)}
          />
          <PayItem
            title={String.payOneMonth}
            money={moneyMonth}
            dur={`/${String.month}`}
            comment={String.payOneMonthComment}
            sel={payMode == 1}
            onPress={() => setPayMode(1)}
          />
          <PayItem
            title={String.payOneYear}
            money={moneyYear}
            dur={`/${String.year}`}
            comment={Util.strFormat(String.payOneYearComment, moneyYear / 12)}
            sel={payMode == 2}
            onPress={() => setPayMode(2)}
          />
        </View>
        <TouchableOpacity
          style={[Themes.button, {marginTop: 20}]}
          onPress={() => payHandler()}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={Themes.buttonText}>{String.payNow}</Text>
          )}
        </TouchableOpacity>
        <View style={styles.underText}>
          <Text style={[Themes.text]}>{String.payAgree1}</Text>
          <Text
            style={[Themes.text, {color: Colors.hypelink}]}
            onPress={() => Linking.openURL(ENV.urlAgreement)}>
            {String.payAgree2}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  endDate: {
    color: Colors.blue,
    fontWeight: 'bold',
    fontSize: 16,
    margin: 10,
  },
  vipTequan: {
    color: Colors.tomato,
    fontWeight: 'bold',
    fontSize: 16,
    margin: 10,
    textAlign: 'center',
  },
  underText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  body: {
    marginTop: 20,
    flexDirection: 'row',
  },
});

export default VIPScreen;
