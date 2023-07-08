import ENV from '../env';

export const fetchAllTagsAPI = async (page, screen, section, search) => {
  try {
    console.log(
      `${ENV.urlAPI}/tag/gettags?page=${page}&screen=${screen}&section=${section}&search=${search}&userid=${ENV.userid}&token=${ENV.token}`,
    );
    const response = await fetch(
      `${ENV.urlAPI}/tag/gettags?page=${page}&screen=${screen}&section=${section}&search=${search}&userid=${ENV.userid}&token=${ENV.token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
    const resData = await response.json();
    // console.log('-------------------', screen);
    // console.log(JSON.stringify(resData, null, 2));
    return resData;
  } catch (e) {
    throw e;
  }
};

export const setFollowTagAPI = async (tag_id, follow_mode) => {
  try {
    console.log(`${ENV.urlAPI}/tag/setfollow`);
    console.log(
      'body:',
      JSON.stringify({
        userid: ENV.userid,
        tag_id: tag_id,
        follow_mode: follow_mode,
        token: ENV.token,
      }),
    );

    const response = await fetch(`${ENV.urlAPI}/tag/setfollow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        userid: ENV.userid,
        token: ENV.token,
        tag_id: tag_id,
        follow_mode: follow_mode,
      }),
    });
    return response;
  } catch (e) {
    throw e;
  }
};
