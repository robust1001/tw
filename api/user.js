import ENV from '../env';
import {Bmob} from '../bmob/bmob';

export const verifyPhoneCode = async (phoneNumber, verifyCode) => {
  await Bmob.Sms.verifySmsCode(phoneNumber, verifyCode);
};

export const pswdSignupAPI = async (phoneNumber, verifyCode, password) => {
  try {
    await verifyPhoneCode(phoneNumber, verifyCode);

    console.log(`${ENV.urlAPI}/user/pswdsignup`);
    console.log(
      'body:',
      JSON.stringify({
        appId: ENV.BMOB.APPID,
        phoneNumber,
        password,
        devInfo: ENV.DEV_INFO,
      }),
    );

    const response = await fetch(`${ENV.urlAPI}/user/pswdsignup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appId: ENV.BMOB.APPID,
        phoneNumber,
        password,
        devInfo: ENV.DEV_INFO,
      }),
    });
    const resData = await response.json();
    return resData;
  } catch (e) {
    throw e;
  }
};

export const getMyInfoAPI = async (userid, token) => {
  try {
    console.log(`${ENV.urlAPI}/user/getmyinfo?userid=${userid}&token=${token}`);
    const response = await fetch(
      `${ENV.urlAPI}/user/getmyinfo?userid=${userid}&token=${token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const resData = await response.json();
    return resData;
  } catch (e) {
    throw e;
  }
};

export const getUserInfoAPI = async userId => {
  try {
    console.log(
      `${ENV.urlAPI}/user/getuserinfo?userid=${userId}&token=${ENV.token}`,
    );
    const response = await fetch(
      `${ENV.urlAPI}/user/getuserinfo?userid=${userId}&token=${ENV.token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const resData = await response.json();
    return resData;
  } catch (e) {
    throw e;
  }
};

export const pswdLoginAPI = async (userid, password) => {
  try {
    console.log(`${ENV.urlAPI}/user/pswdlogin`);
    console.log(
      'body:',
      JSON.stringify({
        appId: ENV.BMOB.APPID,
        twid: userid,
        password: password,
        devInfo: ENV.DEV_INFO,
      }),
    );

    const response = await fetch(`${ENV.urlAPI}/user/pswdlogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appId: ENV.BMOB.APPID,
        twid: userid,
        password: password,
        devInfo: ENV.DEV_INFO,
      }),
    });

    const resData = await response.json();
    return resData;
  } catch (e) {
    throw e;
  }
};

export const phoneLoginAPI = async (phoneNumber, verifyCode) => {
  try {
    await verifyPhoneCode(phoneNumber, verifyCode);

    console.log(`${ENV.urlAPI}/user/phonelogin`);
    console.log(
      'body:',
      JSON.stringify({
        appId: ENV.BMOB.APPID,
        phoneNumber,
        devInfo: ENV.DEV_INFO,
      }),
    );
    const response = await fetch(`${ENV.urlAPI}/user/phonelogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appId: ENV.BMOB.APPID,
        phoneNumber,
        devInfo: ENV.DEV_INFO,
      }),
    });

    const resData = await response.json();
    return resData;
  } catch (e) {
    throw e;
  }
};

export const weixinSignupAPI = async (
  phoneNumber,
  verifyCode,
  nickname,
  unionid,
  headimgurl,
) => {
  try {
    await verifyPhoneCode(phoneNumber, verifyCode);

    console.log(`${ENV.urlAPI}/user/wechatsignup`);
    console.log(
      'body:',
      JSON.stringify({
        appId: ENV.BMOB.APPID,
        phoneNumber,
        nickname: nickname,
        unionid: unionid,
        headimgurl: headimgurl,
        devInfo: ENV.DEV_INFO,
      }),
    );

    const response = await fetch(`${ENV.urlAPI}/user/wechatsignup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        appId: ENV.BMOB.APPID,
        phoneNumber,
        nickname: nickname,
        unionid: unionid,
        headimgurl: headimgurl,
        devInfo: ENV.DEV_INFO,
      }),
    });

    const resData = await response.json();
    return resData;
  } catch (e) {
    throw e;
  }
};

export const weixinLoginAPI = async (nickname, unionid, headimgurl) => {
  try {
    console.log(`${ENV.urlAPI}/user/wechatlogin`);
    console.log(
      'body:',
      JSON.stringify({
        appId: ENV.BMOB.APPID,
        nickname: nickname,
        unionid: unionid,
        headimgurl: headimgurl,
        devInfo: ENV.DEV_INFO,
      }),
    );

    const response = await fetch(`${ENV.urlAPI}/user/wechatlogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        appId: ENV.BMOB.APPID,
        nickname: nickname,
        unionid: unionid,
        headimgurl: headimgurl,
        devInfo: ENV.DEV_INFO,
      }),
    });

    const resData = await response.json();
    return resData;
  } catch (e) {
    throw e;
  }
};

export const delUserAPI = async () => {
  try {
    console.log(
      `${ENV.urlAPI}/user/deleteaccount?userid=${ENV.userid}&token=${ENV.token}`,
    );
    const response = fetch(
      `${ENV.urlAPI}/user/deleteaccount?userid=${ENV.userid}&token=${ENV.token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response;
  } catch (e) {
    throw e;
  }
};

export const updateUserProfileAPI = async body => {
  try {
    console.log(`${ENV.urlAPI}/user/updateinfo`);
    console.log(
      'body:',
      JSON.stringify({
        userid: ENV.userid,
        token: ENV.token,
      }),
    );

    const response = await fetch(`${ENV.urlAPI}/user/updateinfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        ...body,
        userid: ENV.userid,
        token: ENV.token,
      }),
    });
    const resData = await response.json();
    return resData;
  } catch (e) {
    throw e;
  }
};
