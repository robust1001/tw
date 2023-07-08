import * as wechat from 'react-native-wechat-lib';
import parser from 'fast-xml-parser';
import md5 from 'md5';

import Util from './Util';
import ENV from '../env';
import String from '../constants/String';
import {weixinLoginAPI} from '../api/user';

class Weixin {
  constructor() {}

  wxRegisterApp = appid => {
    console.log('wechat.registerApp:', appid);
    wechat.registerApp(appid);
  };

  isWXAppInstalled = async () => {
    const res = await wechat.isWXAppInstalled();
    console.log('isWXAppInstalled:', res);
    return res;
  };

  wxLoginHandler = async () => {
    var code;
    try {
      //返回code码，通过code获取access_token
      const responseCode = await wechat.sendAuthRequest(
        ENV.WX.AUTH_SCOPE,
        ENV.WX.STATE,
      );
      code = responseCode.code;
    } catch (e) {
      console.log(e);
      // Util.showMessage(e);
      const response2 = await fetch(
        `${ENV.urlAPI}/test1?state=${JSON.stringify({state: e})}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return {result: false};
    }

    const response = await fetch(`${ENV.urlAPI}/user/wechatinfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
      }),
    });

    const resData = await response.json();

    ENV.WX.nickname = resData.nickname;
    ENV.WX.unionid = resData.unionid;
    ENV.WX.avatarUrl = resData.headimgurl;

    try {
      return await weixinLoginAPI(
        ENV.WX.nickname,
        ENV.WX.unionid,
        ENV.WX.avatarUrl,
      );
    } catch (error) {
      console.log('login failed 2', error);
      Util.showMessage(String.exception);
      return {result: false};
    }
  };

  wxShareToSessionHandler = async (
    title,
    description,
    thumbImage,
    type,
    webpageUrl,
  ) => {
    wechat
      .shareToSession({
        title: title,
        description: description,
        thumbImage: thumbImage,
        type: type,
        webpageUrl: webpageUrl,
      })
      .catch(error => {
        console.log('shareToSession error:', error.message);
      });
  };

  wxShareToMomentHandler = async (
    title,
    description,
    thumbImage,
    type,
    webpageUrl,
  ) => {
    wechat
      .shareToTimeline({
        title: title,
        description: description,
        thumbImage: thumbImage,
        type: type,
        webpageUrl: webpageUrl,
      })
      .catch(error => {
        console.log('shareToTimeline error:', error.message);
      });
  };

  wxPayHandler = async amount => {
    console.log('wxPayHandler amount:', amount);
    const response1 = await fetch(
      `${ENV.urlAPI}/subscription/getprepayid?amount=${amount}&userid=${ENV.userid}&token=${ENV.token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const resData1 = await response1.json();
    if (!resData1.result) {
      console.log('get prepay id error');
    } else {
      let xmlData = resData1.prepay_id.original.toString();
      const json = parser.parse(xmlData);
      const prepay_id = json.xml.prepay_id;
      console.log('prepay_id:', prepay_id);

      const timestamp = Date.now() / 1000; // This would be the timestamp you want to format
      const nonceStr = this.makeNonceStr(32);

      var payInfo = {
        appId: ENV.WX.APPID,
        partnerId: ENV.WX.MERCHANT_ID, // 商家向财付通申请的商家id
        prepayId: prepay_id, // 预支付订单
        nonceStr: nonceStr, // 随机串，防重发
        timeStamp: timestamp, // 时间戳，防重发.
        package: 'Sign=WXPay', // 商家根据财付通文档填写的数据和签名
        sign: 'xxxxxxxxx', // 商家根据微信开放平台文档对数据做的签名
      };
      // payInfo.sign = this.getPaySignStrMethod(payInfo);
      // console.log('payInfo.sign1:', payInfo.sign);

      const response2 = await fetch(`${ENV.urlAPI}/subscription/getsignstr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appId: ENV.WX.APPID,
          partnerId: ENV.WX.MERCHANT_ID, // 商家向财付通申请的商家id
          prepayId: prepay_id, // 预支付订单
          nonceStr: nonceStr, // 随机串，防重发
          timeStamp: timestamp, // 时间戳，防重发.
          package: 'Sign=WXPay', // 商家根据财付通文档填写的数据和签名
          sign: 'xxxxxxxxx', // 商家根据微信开放平台文档对数据做的签名
          userid: ENV.userid,
          token: ENV.token,
        }),
      });

      const resData2 = await response2.json();
      if (resData2.result) {
        payInfo.sign = resData2.sign;
        console.log('payInfo.sign2:', payInfo.sign);
        return await wechat.pay(payInfo);
      } else {
        console.log('get prepay id error');
      }
    }
  };

  wxXufeiHandler = async (first, month) => {
    console.log(`${ENV.urlAPI}/subscription/xufei`);
    const response1 = await fetch(`${ENV.urlAPI}/subscription/xufei`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first: first,
        month: month,
        userid: ENV.userid,
        token: ENV.token,
      }),
    });

    const resData1 = await response1.json();
    if (resData1.result) {
    } else {
      console.log('get prepay id error');
    }
  };

  getPaySignStrMethod = payInfo => {
    if (
      payInfo.appId !== undefined &&
      payInfo.appId !== '' &&
      payInfo.nonceStr !== undefined &&
      payInfo.nonceStr !== '' &&
      payInfo.partnerId !== undefined &&
      payInfo.partnerId !== '' &&
      payInfo.prepayId !== undefined &&
      payInfo.prepayId !== '' &&
      payInfo.timeStamp !== undefined &&
      payInfo.timeStamp !== ''
    ) {
      let s =
        'appid=' +
        payInfo.appId +
        '&noncestr=' +
        payInfo.nonceStr +
        '&package=' +
        payInfo.package +
        '&partnerid=' +
        payInfo.partnerId +
        '&prepayid=' +
        payInfo.prepayId +
        '&timestamp=' +
        payInfo.timeStamp +
        '&key=' +
        'nWhMHku2oconqUzvRQveyeSMwJ2tm8ux';
      //ENV.WX.MERCHANT_KEY;
      console.log('s:', s);
      const res = md5(s).toUpperCase();
      return res;
    } else {
      return null;
    }
  };

  makeNonceStr = length => {
    var result = [];
    var characters =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength)),
      );
    }
    return result.join('');
  };
}

export default new Weixin();
