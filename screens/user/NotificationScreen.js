import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {GiftedChat} from 'react-native-gifted-chat';
import {
  fetchNotifications,
  readNotifications,
} from '../../store/features/chatSlice';
import Header from '../../components/Header';
import ENV from '../../env';
import String from '../../constants/String';

const NotificationScreen = props => {
  const dispatch = useDispatch();
  const notifList = useSelector(state => state.chat.notifList);
  const fetch_notif_id = useSelector(state => state.chat.fetch_notif_id);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await dispatch(readNotifications(fetch_notif_id));
    }
    fetchData();
  }, []);

  const gettime = newMsg => {
    let Offset = new Date().getTimezoneOffset();
    var now = new Date(
      // new Date(newMsg.created_at.replace(' ', 'T')).getTime() +
      //   Offset * 60 * 1000,
      new Date(newMsg.updated_at.replace(' ', 'T')).getTime(),
    );
    return now;
  };

  useEffect(() => {
    const resultChats = notifList.map(newMsg => {
      return {
        _id: newMsg.id,
        text: newMsg.content,
        createdAt: gettime(newMsg),
        user: {
          _id: 0,
        },
      };
    });
    setMessages(resultChats);
    dispatch(readNotifications(fetch_notif_id));
  }, [notifList]);

  const customtInputToolbar = props => {
    return <></>;
  };

  const renderAvatar = props => {
    return <></>;
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header back title={String.notification} />
      <GiftedChat
        messages={messages}
        user={{
          _id: ENV.userid,
        }}
        locale={'zh-cn'}
        renderAvatarOnTop={true}
        renderAvatar={renderAvatar}
        alignTop={false}
        renderInputToolbar={props => customtInputToolbar(props)}
        showAvatarForEveryMessage={true}
      />
    </View>
  );
};

export default NotificationScreen;
