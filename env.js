vars = {
  version: '1.0.03',
  mainUrl: 'http://192.168.1.108:8000',
  msgMode: 0,
  vipMode: true,
  inRoom: false,
  expire_notice_base: 1000000,

  urlDownload: '', //StartupScreen
  urlPrivacy: '', //StartupScreen
  urlAgreement: '', //StartupScreen
  urlCompany: '', //StartupScreen
  urlPayAgree: '', //StartupScreen

  money_first: '', //StartupScreen
  money_month: '', //StartupScreen
  money_year: '', //StartupScreen

  server_version: '', //StartupScreen
  incomp_version: '', //StartupScreen

  urlBackend: '', //StartupScreen
  urlChat: '', //StartupScreen
  urlWeb: '', //StartupScreen
  urlAPI: '', //StartupScreen

  last_notif_id: 0,
  maintain: 0,

  userid: '',
  token: '',

  BMOB: {
    APPID: '', //StartupScreen
    REST_APIKEY: '', //StartupScreen
  },

  WX: {
    APPID: '', //StartupScreen
    AUTH_SCOPE: 'snsapi_userinfo', //Constant
    STATE: 'wechat_sdk_demo', //Constant
    MERCHANT_ID: '', //StartupScreen
    MERCHANT_KEY: '',
    nickname: '',
    unionid: '',
    avatarUrl: '',
  },

  //GetDeviceInfo
  DEV_INFO: {
    deviceId: '',
    deviceName: '',
    mac: '',
    model: '',
    serialNumber: '',
    uniqueId: '',
    imei: '',
  },
};

export default vars;
