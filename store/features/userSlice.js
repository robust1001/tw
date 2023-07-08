import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {updateUserProfileAPI} from '../../api/user';
import String from '../../constants/String';
import ENV from '../../env';
import Util from '../../utils/Util';

const initialState = {
  userid: 0,
  token: '',

  twid: '',
  whchat_id: '',
  nickname: '',
  phone: '',
  logo: '',
  location: '',
  gender: '',
  birthday: '',
  job: '',
  pos: '',
  expire_date: '',
};

export const updateUserProfile = createAsyncThunk(
  '/user/updateUserProfileStatus',
  async (payload, thunkAPI) => {
    await updateUserProfileAPI(payload);
    return payload;
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile(state, action) {
      state[action.payload.key] = action.payload.value;
    },
    setMyInfo(state, action) {
      const myInfo = action.payload.info;
      console.log('myInfo ---> ', JSON.stringify(myInfo, null, 2));
      ENV.userid = myInfo.userid;
      ENV.token = myInfo.token;
      const user = {
        userid: myInfo.userid,
        token: myInfo.token,
      };
      if (user.userid != null && user.token != null)
        Util.setStorageItem('userStorageData', JSON.stringify(user));

      state.twid = myInfo.twid;
      state.whchat_id = myInfo.wechat_id;
      state.nickname = myInfo.nickname;
      state.phone = myInfo.phone;
      state.logo = myInfo.logo;
      state.location = myInfo.state + '/' + myInfo.city;
      state.gender = myInfo.gender;
      state.birthday = myInfo.birthday;
      state.job = myInfo.job;
      state.pos = myInfo.pos;
      state.expire_date = myInfo.expire_date;
    },
  },
  extraReducers: builder => {
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      const [key, value] = Object.entries(action.payload)[0];
      console.log(key + ':' + value);
      state[key] = value;
    });
  },
});

export const {setUserProfile, setMyInfo} = userSlice.actions;

export default userSlice.reducer;
