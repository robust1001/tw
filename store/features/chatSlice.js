import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  delChatUserAPI,
  fetchChatsAPI,
  fetchChatUserListAPI,
  fetchNotificationsAPI,
  readNotificationsAPI,
} from '../../api/chat';
import ENV from '../../env';

const initialState = {
  inRoom: false,
  userList: [],
  allChats: [],
  isEnd: false,

  read_notif_id: 0,
  fetch_notif_id: 0,
  noread_count: 0,
  notifList: [],
};

export const fetchChatUserAndNotiList = createAsyncThunk(
  '/chat/fetchChatUserListStatus',
  async (payload, thunkAPI) => {
    const response = await fetchChatUserListAPI();
    return response;
  },
);

export const deleteChatUser = createAsyncThunk(
  '/chat/deleteChatUserStatus',
  async (payload, thunkAPI) => {
    const response = await delChatUserAPI(payload.oppId);
    return response;
  },
);

export const fetchChats = createAsyncThunk(
  '/chat/fetchChatsStatus',
  async (payload, thunkAPI) => {
    const response = await fetchChatsAPI(payload.oppId, payload.from);
    return {from: payload.from, response};
  },
);

export const fetchNotifications = createAsyncThunk(
  '/user/fetchNotificationStatus',
  async (payload, thunkAPI) => {
    const response = await fetchNotificationsAPI();
    return response;
  },
);

export const readNotifications = createAsyncThunk(
  '/user/readNotificationStatus',
  async (payload, thunkAPI) => {
    const response = await readNotificationsAPI(payload);
    return response;
  },
);

const last_read_id = list => {
  let max = 0;
  for (i = 0; i < list.length; i++) {
    if (max < list[i].id) max = list[i].id;
  }
  // console.log('max: ', max);
  return max;
};

const noreadCount = (list, last_read_id) => {
  let count = 0;
  for (i = 0; i < list.length; i++) {
    if (list[i].id > last_read_id) count++;
  }
  // console.log('count: ', count);
  return count;
};

const getExpireNotify = list => {
  //console.log(JSON.stringify(list));

  const msgs = list.map(item => ({
    id: ENV.expire_notice_base + item.id,
    content: String.expireMsg.replace('*****', item.title),
    active: 1,
    user_id: -1,
    created_at: item.deadline,
    updated_at: item.deadline,
  }));

  return msgs;
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addChat(state, action) {
      state.allChats = [action.payload, ...state.allChats];
    },
    clearChat(state, action) {
      state.allChats = [];
      state.isEnd = false;
    },
    InRoom(state, action) {
      state.inRoom = action.payload;
    },
    clearUnread(state, action) {
      const oppId = action.payload;
      const oppIndex = state.userList.findIndex(item => item.sender == oppId);
      if (oppIndex != -1) {
        const userList = [...state.userList];
        userList[oppIndex].unread = 0;
        state.userList = [...userList];
      }
    },
    updateNotification(state, action) {
      const list = action.payload;
      console.log('updateNotification:', list.id, state.fetch_notif_id);
      if (list.id > state.fetch_notif_id) {
        state.notifList = [list, ...state.notifList];
        state.fetch_notif_id = list.id;
        state.noread_count = noreadCount(state.notifList, state.read_notif_id);
      }
    },
    updateChatStatus(state, action) {
      const message = action.payload;
      console.log('message: ', JSON.stringify(message, null, 2));
      let oppId = message.sender;
      if (message.sender == ENV.userid) oppId = message.receiver;

      const oppIndex = state.userList.findIndex(item => item.userid == oppId);
      if (oppIndex == -1) {
        //聊天用户目录里不在的用户
        console.log('Add new item');
        const user = {
          userid: oppId,
          sender: message.sender,
          last_message: message.message,
          updated_at: message.created_at,
          unread: message.unread,
          deleted: 0,
          last_type: message.type,
          nickname:
            message.sender == ENV.userid
              ? message.b_nickname
              : message.a_nickname,
          logo: message.sender == ENV.userid ? message.b_logo : message.a_logo,
        };
        state.userList = [user, ...state.userList]; //表示刚到的聊天在目录的顶上
      } else {
        //聊天用户目录里已存在的用户
        const userList = [...state.userList];
        const user = {
          userid: userList[oppIndex].userid,
          sender: message.sender,
          last_message: message.message,
          updated_at: message.created_at,
          unread:
            userList[oppIndex].unread + message.sender == oppId
              ? message.unread
              : 0,
          deleted: userList[oppIndex].deleted,
          last_type: message.type,
          nickname: userList[oppIndex].nickname,
          logo: userList[oppIndex].logo,
        };
        const tempList = userList.filter(item => item.userid != oppId);
        state.userList = [user, ...tempList]; //表示刚到的聊天在目录的顶上
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchChatUserAndNotiList.fulfilled, (state, action) => {
      state.userList = action.payload.list;
      const notifList = action.payload.notif;
      state.read_notif_id = notifList.read_notif_id;
      state.fetch_notif_id = last_read_id(notifList.noti_list);
      state.noread_count = noreadCount(
        notifList.noti_list,
        notifList.read_notif_id,
      );
      const expireNotifyList = getExpireNotify(notifList.expire_list);
      state.notifList = [...expireNotifyList, ...notifList.noti_list];
    });
    builder.addCase(deleteChatUser.fulfilled, (state, action) => {
      state.userList = action.payload.list;
    });
    builder.addCase(fetchChats.fulfilled, (state, action) => {
      const response = action.payload.response;
      // console.log('response:', response);
      state.isEnd = response.isEnd;
      const from = action.payload.from;
      if (from == 0) {
        state.allChats = response.list;
      } else {
        state.allChats = [...state.allChats, ...response.list];
      }
    });
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      const notifList = action.payload;
      //console.log('notifList:', JSON.stringify(notifList, null, 2));
      if (notifList.result == true) {
        state.read_notif_id = notifList.read_notif_id;
        state.fetch_notif_id = last_read_id(notifList.list);
        state.noread_count = noreadCount(
          notifList.list,
          notifList.read_notif_id,
        );
        const expireNotifyList = getExpireNotify(notifList.expire);
        state.notifList = [...expireNotifyList, ...notifList.list];
      }
    });
    builder.addCase(readNotifications.fulfilled, (state, action) => {
      const notifList = action.payload;
      if (notifList.result == true) {
        state.read_notif_id = state.fetch_notif_id;
        state.noread_count = 0;
        state.userList[0].unread = 0;
      }
    });
  },
});

export const {
  addChat,
  clearChat,
  InRoom,
  clearUnread,
  updateChatStatus,
  updateNotification,
} = chatSlice.actions;

export default chatSlice.reducer;
