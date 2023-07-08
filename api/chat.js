import ENV from '../env';

export const fetchChatUserListAPI = async () => {
  try {
    console.log(
      `${ENV.urlAPI}/chat/getuserlist?userid=${ENV.userid}&token=${ENV.token}`,
    );
    const response = await fetch(
      `${ENV.urlAPI}/chat/getuserlist?userid=${ENV.userid}&token=${ENV.token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const resData = await response.json();
    // console.log('fetchChatUserListAPI:', JSON.stringify(resData, null, 2));
    return resData;
  } catch (e) {
    throw e;
  }
};

export const fetchChatsAPI = async (oppId, from) => {
  try {
    console.log(
      `${ENV.urlAPI}/chat/getchathistory?oppid=${oppId}&from=${from}&userid=${ENV.userid}&token=${ENV.token}`,
    );
    const response = await fetch(
      `${ENV.urlAPI}/chat/getchathistory?oppid=${oppId}&from=${from}&userid=${ENV.userid}&token=${ENV.token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const resData = await response.json();
    console.log('fetchChatsAPI:', JSON.stringify(resData, null, 2));
    return resData;
  } catch (e) {
    throw e;
  }
};

export const delChatUserAPI = async oppId => {
  try {
    console.log(
      `${ENV.urlAPI}/chat/deluser?oppId=${oppId}&userid=${ENV.userid}&token=${ENV.token}`,
    );
    const response = await fetch(
      `${ENV.urlAPI}/chat/deluser?oppId=${oppId}&userid=${ENV.userid}&token=${ENV.token}`,
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

export const fetchNotificationsAPI = async () => {
  try {
    console.log(
      `${ENV.urlAPI}/notification/getlist?userid=${ENV.userid}&token=${ENV.token}`,
    );
    const response = await fetch(
      `${ENV.urlAPI}/notification/getlist?userid=${ENV.userid}&token=${ENV.token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const resData = await response.json();
    console.log('fetchNotificationsAPI:', JSON.stringify(resData, null, 2));
    return resData;
  } catch (e) {
    throw e;
  }
};

export const readNotificationsAPI = async fetch_notif_id => {
  try {
    console.log(
      `${ENV.urlAPI}/notification/read?read_notif_id=${fetch_notif_id}&userid=${ENV.userid}&token=${ENV.token}`,
    );
    const response = await fetch(
      `${ENV.urlAPI}/notification/read?read_notif_id=${fetch_notif_id}&userid=${ENV.userid}&token=${ENV.token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const resData = await response.json();
    console.log('readNotificationsAPI:', JSON.stringify(resData, null, 2));
    return resData;
  } catch (e) {
    throw e;
  }
};
