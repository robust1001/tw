import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import ImageModal from 'react-native-image-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RBSheet from 'react-native-raw-bottom-sheet';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import {useIsFocused} from '@react-navigation/native';
//const dayjs = require('dayjs');
import 'dayjs/locale/zh-cn';

import ENV from '../../env';
import Colors from '../../constants/Colors';
import Util from '../../utils/Util';
import String from '../../constants/String';
import {
  clearChat,
  fetchChats,
  clearUnread,
  InRoom,
  readNotifications,
} from '../../store/features/chatSlice';
import Header from '../../components/Header';
import TakePic from '../../components/TakePic';
import {withContext} from '../../context';

// let ws;

const ChatScreen = props => {
  const [roomid, setRoomid] = useState(0);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [from, setFrom] = useState(0);
  const refRBSheetImage = useRef();
  const refRBSheetEmoji = useRef();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const chats = useSelector(state => state.chat.allChats);
  const isEnd = useSelector(state => state.chat.isEnd);
  const notifList = useSelector(state => state.chat.notifList);
  const fetch_notif_id = useSelector(state => state.chat.fetch_notif_id);

  const {route} = props;
  const myId = ENV.userid;
  const oppId = route.params.userid;
  const socket = props.value.current;
  console.log('socket: ', socket.readyState); //need to handle when socket server is down
  const isAdmin = oppId == 0;

  //newChat.created_at是正确的时间，但是地域设定为'zh-cn'，所以GiftedChat自动加8个小时显示。
  //所以我们要设定减8个小时的时间，这就才显示出来正确的时间。
  const gettime = newChat => {
    let Offset = new Date().getTimezoneOffset();
    var now = new Date(
      // new Date(newChat.created_at.replace(' ', 'T')).getTime() +
      //   Offset * 60 * 1000,
      new Date(newChat.created_at.replace(' ', 'T')).getTime(),
    );
    return now;
  };

  useEffect(() => {
    if (isAdmin) return;

    const resultChats = chats.map(newChat => {
      var img, txt;
      // console.log('newChat:', newChat);
      if (newChat.type == 'T') {
        img = '';
        txt = newChat.message;
      }
      if (newChat.type == 'I') {
        img = newChat.message;
        txt = '';
      }
      // console.log('newChat.logo:', newChat.logo);
      // console.log('newChat.logo1:', ENV.urlBackend + newChat.logo);
      // console.log('newChat.logo2:', Util.getThumbImage1(newChat.logo, true));
      return {
        _id: newChat.id,
        text: txt,
        createdAt: gettime(newChat),
        user: {
          _id: newChat.sender,
          name: newChat.name,
          //avatar: ENV.urlBackend + newChat.logo,
          avatar: Util.getThumbImage1(newChat.logo, true),
        },
        image: img,
      };
    });
    setMessages(resultChats);
    setFrom(resultChats.length);
  }, [chats]);

  useEffect(() => {
    if (!isAdmin) return;
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

  useEffect(() => {
    async function fetchData() {
      if (isAdmin) {
        await dispatch(readNotifications(fetch_notif_id));
      } else {
        dispatch(clearUnread(oppId));
        const resData = await dispatch(fetchChats({oppId, from}));
        setFrom(from + resData.payload.response.count);
        setRoomid(resData.payload.response.roomid);
        // dispatch(InRoom(true));
        ENV.inRoom = true;
        var msg = {
          socket_type: 'chat',
          room_id: resData.payload.response.roomid,
          message: '',
          type: 'ER', //Enter room
          sender: myId,
          receiver: oppId,
        };
        socket.send(JSON.stringify(msg));
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!isFocused) {
      if (isAdmin) return;
      // dispatch(InRoom(false));
      ENV.inRoom = false;
      var msg = {
        socket_type: 'chat',
        room_id: roomid,
        message: '',
        type: 'LR', //Leave room
        sender: myId,
        receiver: oppId,
      };
      socket.send(JSON.stringify(msg));
      dispatch(clearChat(oppId));
    }
  }, [isFocused]);

  const SendImage = async url => {
    onSend(url, 'I');
  };

  const sendImage = imagePath => {
    Util.uploadImage(imagePath)
      .then(res => {
        //console.log('image upload res: ', res.data);
        const resData = res.json();
        SendImage(ENV.urlBackend + resData.url);
      })
      .catch(error => {
        console.log('image upload error: ', error);
      });
  };

  const takePicture = async mode => {
    refRBSheetImage.current.close();
    Util.takeImage(mode)
      .then(image => {
        console.log('image:', image.path);
        sendImage(image.path);
      })
      .catch(err => {
        console.log('no image');
      });
  };

  const takeEmoji = async emoji => {
    refRBSheetEmoji.current.close();
    console.log('emoji:', emoji);
    //console.log('code:', charFromUtf16(emoji));
    setText(text + emoji);
  };

  const customtInputToolbar = props => {
    return isAdmin ? (
      <></>
    ) : (
      <InputToolbar {...props} containerStyle={{padding: 0}} />
    );
  };

  const renderAvatar = props => {
    return <></>;
  };

  const renderMessageImage = props => {
    return (
      <View
        style={{
          borderRadius: 15,
          padding: 2,
        }}>
        <ImageModal
          resizeMode="contain"
          style={styles.imgMessage}
          source={{uri: props.currentMessage.image}}
        />
      </View>
    );
  };

  // const onSend = useCallback((messages, type) => {
  //   try {
  //     let nowtime = new Date();
  //     console.log('nowtime: ', nowtime);
  //     console.log('onSend:', messages);
  //     var msg = {
  //       socket_type: 'chat',
  //       room_id: roomid,
  //       message: messages,
  //       type: type,
  //       sender: myId,
  //       receiver: oppId,
  //     };
  //     // ws.send(JSON.stringify(msg));
  //     socket.send(JSON.stringify(msg));
  //     setText('');
  //   } catch (e) {
  //     console.log(e);
  //   }
  // });

  const onSend = (messages, type) => {
    try {
      let nowtime = new Date();
      console.log('nowtime: ', nowtime);
      console.log('onSend:', messages);
      var msg = {
        socket_type: 'chat',
        room_id: roomid,
        message: messages,
        type: type,
        sender: myId,
        receiver: oppId,
      };
      // ws.send(JSON.stringify(msg));
      socket.send(JSON.stringify(msg));
      setText('');
    } catch (e) {
      console.log(e);
    }
  };

  const renderLoadEarlier = props => {
    console.log('isEnd:', isEnd);
    return !isEnd ? (
      <TouchableOpacity
        onPress={() => {
          async function fetchData() {
            dispatch(fetchChats({oppId, from}));
          }
          fetchData();
        }}>
        <View>
          <Text style={styles.textCenter}>{String.viewPrevChatHistory}</Text>
        </View>
      </TouchableOpacity>
    ) : (
      <></>
    );
  };

  const renderActions = props => (
    <>
      <View style={{alignSelf: 'center'}}>
        <TouchableOpacity onPress={() => refRBSheetImage.current.open()}>
          <Ionicons name="image-outline" size={32} />
        </TouchableOpacity>
      </View>
      <View style={{alignSelf: 'center'}}>
        <TouchableOpacity onPress={() => refRBSheetEmoji.current.open()}>
          <Ionicons name="happy-outline" size={32} />
        </TouchableOpacity>
      </View>
      <RBSheet
        ref={refRBSheetImage}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <TakePic handler={mode => takePicture(mode)} />
      </RBSheet>
      <RBSheet
        ref={refRBSheetEmoji}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <EmojiSelector
          category={Categories.emotion}
          onEmojiSelected={emoji => takeEmoji(emoji)}
          showSearchBar={false}
          showTabs={false}
          showSectionTitles={false}
          columns={12}
        />
      </RBSheet>
    </>
  );

  const sendText = text => {
    if (text != '') onSend(text, 'T');
  };

  const renderSend = props => (
    <View style={{alignSelf: 'center'}}>
      <TouchableOpacity onPress={() => sendText(text)}>
        <Ionicons name="arrow-redo-outline" size={32} />
      </TouchableOpacity>
    </View>
  );

  const renderComposer = props => {
    return (
      <TextInput
        style={styles.inputs}
        value={text}
        underlineColorAndroid="transparent"
        maxLength={20}
        autoCapitalize="none"
        onChangeText={text => setText(text)}
        placeholder={String.pleaseInputChatMsg}
      />
    );
  };

  const onLongPress = (context, message) => {
    console.log('onLongPress');
  };

  const onPressAvatar = user => {
    props.navigation.navigate('UserProfile', {userId: user._id});
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header back title={isAdmin ? String.tw_admin : route.params.username} />
      {isAdmin ? (
        <GiftedChat
          messages={messages}
          user={{
            _id: ENV.userid,
          }}
          locale={'zh-cn'}
          renderAvatarOnTop={true}
          alignTop={false}
          renderAvatar={renderAvatar}
          showAvatarForEveryMessage={true}
          renderInputToolbar={props => customtInputToolbar(props)}
        />
      ) : (
        <GiftedChat
          messages={messages}
          user={{
            _id: myId,
          }}
          locale={'zh-cn'}
          renderAvatarOnTop={true}
          alignTop={false}
          alwaysShowSend={true}
          onPressAvatar={onPressAvatar}
          renderActions={renderActions}
          renderSend={renderSend}
          renderComposer={renderComposer}
          renderMessageImage={renderMessageImage}
          keyboardShouldPersistTaps={'never'}
          loadEarlier={true}
          renderLoadEarlier={renderLoadEarlier}
          onLongPress={onLongPress}
          renderInputToolbar={props => customtInputToolbar(props)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textCenter: {
    textAlign: 'center',
    marginVertical: 10,
    color: Colors.blue,
  },
  imgMessage: {
    width: 200,
    height: 200,
    padding: 4,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  inputs: {
    flex: 1,
    color: Colors.textColor,
    height: '100%',
    marginHorizontal: 4,
  },
});

export default withContext(ChatScreen);
