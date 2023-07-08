import Toast from 'react-native-toast-message';
import {showMessage} from 'react-native-flash-message';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';

import String from '../constants/String';
import ENV from '../env';

class Util {
  constructor() {}

  showMessage = (message, title) => {
    if (ENV.msgMode == 0) {
      Toast.show({
        type: 'success',
        text1: message,
        text2: ' ',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 40,
        autoHide: true,
      });
    } else if (ENV.msgMode == 1) {
      return showMessage({
        // message: title? title: '',
        // description: message,
        message: message,
        type: 'danger',
        icon: {icon: 'danger', position: 'left'},
        duration: 3000,
      });
    }
  };

  uploadImage = async uri => {
    return RNFetchBlob.fetch(
      'POST',
      `${ENV.urlAPI}/uploadfile`,
      {
        'Content-Type': 'multipart/form-data',
      },
      [
        {
          name: 'file',
          filename: uri.toString(),
          type: 'image/png',
          data: RNFetchBlob.wrap(uri),
        },
      ],
    );
  };

  takeImage = async mode => {
    if (mode == 0) {
      return await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        cropperCancelText: '取消',
        cropperChooseText: '选择',
      });
    } else if (mode == 1) {
      return await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        cropperCancelText: '取消',
        cropperChooseText: '选择',
      });
    }
  };

  getThumbImage = (orig, isAvatar) => {
    // console.log('orig:', orig);
    if (!orig || orig == '' || orig == 'null') {
      //console.log('isAvatar:', isAvatar);
      if (isAvatar) {
        return require('../assets/ic_profile_placeholder.png');
      } else {
        return {uri: ''};
      }
    }

    if (
      orig.lastIndexOf('http://') != -1 ||
      orig.lastIndexOf('https://') != -1
    ) {
      //weixin logo
      return {uri: orig};
    }
    let orig1 = ENV.urlBackend + orig;
    if (orig1.lastIndexOf('_thumb.') != -1) return orig1;
    let n = orig1.lastIndexOf('.');
    var thumb = [orig1.slice(0, n), '_thumb', orig1.slice(n)].join('');
    //console.log('thumb:', thumb);
    return {uri: thumb};
  };

  getThumbImage1 = (orig, isAvatar) => {
    //console.log('orig:', orig);
    if (!orig || orig == '' || orig == 'null') {
      return '';
    }

    if (
      orig.lastIndexOf('http://') != -1 ||
      orig.lastIndexOf('https://') != -1
    ) {
      //weixin logo
      return orig;
    }
    let orig1 = ENV.urlBackend + orig;
    if (orig1.lastIndexOf('_thumb.') != -1) return orig1;
    let n = orig1.lastIndexOf('.');
    var thumb = [orig1.slice(0, n), '_thumb', orig1.slice(n)].join('');
    //console.log('thumb:', thumb);
    return thumb;
  };

  getProfilePageTitle = postuserid => {
    console.log('postuserid:', postuserid);
    console.log('ENV.userid:', ENV.userid);
    let page;
    if (postuserid == ENV.userid) page = 'MyProfile';
    else page = 'UserProfile';
    console.log('page:', page);
    return page;
  };

  str2Time = param => {
    let dateComponents = param.split(' ');
    let datePieces = dateComponents[0].split('-');
    let timePieces = dateComponents[1].split(':');
    return new Date(
      datePieces[0],
      datePieces[1] - 1,
      datePieces[2],
      timePieces[0],
      timePieces[1],
      timePieces[2],
    );
  };

  str2Date = param => {
    if (!param) return this.nowTime();
    let datePieces = param.split('-');
    return new Date(datePieces[0], datePieces[1] - 1, datePieces[2], 0, 0, 0);
  };

  //param: 2021-07-10 03:24:53
  //return: 2021年07月10日
  changeDateFormat = param => {
    let date = this.str2Time(param);
    let ret = this.strFormat(
      String.date,
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );
    return ret;
  };

  //param: 2021-07-10 03:24:53
  isPast = param => {
    const today = this.nowTime();
    const date = this.str2Time(param);
    let ret = date.getTime() < today.getTime() ? true : false;
    return ret;
  };

  isVIP = expire_date => {
    return !this.isPast(expire_date);
  };

  //param: 2021-07-10
  getAge = param => {
    const today = this.nowTime();
    const date = this.str2Date(param);
    return today.getFullYear() - date.getFullYear();
  };

  isKaiguo = param => {
    return param != '0000-00-00 00:00:00';
  };

  strFormat = (format, value1 = '', value2 = '', value3 = '') => {
    let s = format;
    if (value1 != '') s = s.replace('{0}', value1);
    if (value2 != '') s = s.replace('{1}', value2);
    if (value3 != '') s = s.replace('{2}', value3);
    return s;
  };

  nowTime = () => {
    let Offset = new Date().getTimezoneOffset();
    var now = new Date(new Date().getTime() - Offset * 60 * 1000);
    return now;
  };

  timeDifference = (current, time) => {
    var time1 = time.replace(' ', 'T');
    const previous = new Date(time1);
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
      return this.strFormat(String.beforXSeconds, Math.round(elapsed / 1000));
    } else if (elapsed < msPerHour) {
      return this.strFormat(
        String.beforXMinutes,
        Math.round(elapsed / msPerMinute),
      );
    } else if (elapsed < msPerDay) {
      return this.strFormat(
        String.beforXHours,
        Math.round(elapsed / msPerHour),
      );
    } else if (elapsed < msPerMonth) {
      return this.strFormat(String.beforXDays, Math.round(elapsed / msPerDay));
    } else if (elapsed < msPerYear) {
      return this.strFormat(
        String.beforXMonths,
        Math.round(elapsed / msPerMonth),
      );
    } else {
      return this.strFormat(
        String.beforXYears,
        Math.round(elapsed / msPerYear),
      );
    }
  };

  removeStorageItem = key => {
    AsyncStorage.removeItem(key);
  };

  getStorageItem = key => {
    return AsyncStorage.getItem(key);
  };

  setStorageItem = (key, value) => {
    AsyncStorage.setItem(key, value);
  };

  getShrinkMsg = (msg, len) => {
    const pos = msg.indexOf('\n');
    if (pos != -1) {
      if (pos > len) return msg.substr(0, len - 1) + '...';
      else return msg.substr(0, pos) + '...';
    }
    if (msg.length > len) {
      return msg.substr(0, len - 1) + '...';
    }
    return msg;
  };
}

export default new Util();
