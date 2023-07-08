import ENV from '../env';

export const fetchPostsAPI = async params => {
  const query = Object.entries(params).reduce((accu, [key, value]) => {
    return accu + `${key}=${value}&`;
  }, '');

  console.log(
    `${ENV.urlAPI}/task/gettasks?${query}userid=${ENV.userid}&token=${ENV.token}`,
  );

  try {
    const response = await fetch(
      `${ENV.urlAPI}/task/gettasks?${query}userid=${ENV.userid}&token=${ENV.token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
    const resData = await response.json();
    //console.log('gettasks:', JSON.stringify(resData, null, 2));
    return resData;
  } catch (e) {
    throw e;
  }
};

export const fetchPostAPI = async params => {
  const query = Object.entries(params).reduce((accu, [key, value]) => {
    return accu + `${key}=${value}&`;
  }, '');

  console.log(
    `${ENV.urlAPI}/task/gettask?${query}userid=${ENV.userid}&token=${ENV.token}`,
  );

  try {
    const response = await fetch(
      `${ENV.urlAPI}/task/gettask?${query}userid=${ENV.userid}&token=${ENV.token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
    const resData = await response.json();
    // console.log('gettask:', JSON.stringify(resData, null, 2));
    return resData;
  } catch (e) {
    throw e;
  }
};

export const checkPostAPI = async params => {
  const query = Object.entries(params).reduce((accu, [key, value]) => {
    return accu + `${key}=${value}&`;
  }, '');

  console.log(
    'query: ',
    `${ENV.urlAPI}/task/check?${query}userid=${ENV.userid}&token=${ENV.token}`,
  );

  try {
    const response = await fetch(
      `${ENV.urlAPI}/task/check?${query}userid=${ENV.userid}&token=${ENV.token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
    const resData = await response.json();
    return resData;
  } catch (e) {
    throw e;
  }
};

export const createPostAPI = async body => {
  try {
    console.log(`${ENV.urlAPI}/task/createtask`);
    console.log(
      'body:',
      JSON.stringify({
        ...body,
        devInfo: ENV.DEV_INFO,
        userid: ENV.userid,
        token: ENV.token,
      }),
    );

    const response = await fetch(`${ENV.urlAPI}/task/createtask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        ...body,
        devInfo: ENV.DEV_INFO,
        userid: ENV.userid,
        token: ENV.token,
      }),
    });
    const resData = await response.json();
    return resData.result;
  } catch (e) {
    throw e;
  }
};

export const deletePostAPI = async postId => {
  try {
    console.log(
      `${ENV.urlAPI}/task/deletetask?taskid=${postId}&userid=${ENV.userid}&token=${ENV.token}`,
    );
    const response = await fetch(
      `${ENV.urlAPI}/task/deletetask?taskid=${postId}&userid=${ENV.userid}&token=${ENV.token}`,
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

export const favoritePostAPI = async (taskId, favorite) => {
  try {
    console.log(`${ENV.urlAPI}/task/setfavorite`);
    console.log(
      'body:',
      JSON.stringify({
        taskid: taskId,
        favorite,
        userid: ENV.userid,
        token: ENV.token,
      }),
    );

    const response = await fetch(`${ENV.urlAPI}/task/setfavorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        taskid: taskId,
        favorite,
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
