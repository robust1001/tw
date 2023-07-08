import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {Badge} from 'react-native-elements';

import ENV from '../env';
import String from '../constants/String';
import Util from '../utils/Util';
import {deleteChatUser} from '../store/features/chatSlice';
import {Themes} from '../utils/Theme';
import Colors from '../constants/Colors';

const ChatListItem = props => {
  const {user} = props;

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [imageUri, setImageUri] = useState(user.logo);

  const menuHandler = async (user, mode) => {
    if (mode == 0) {
      navigation.navigate('Chatting', {
        userid: user.userid,
        username: user.nickname,
      });
    } else if (mode == 1) {
      navigation.navigate(Util.getProfilePageTitle(user.userid), {
        userId: user.userid,
      });
    } else {
      dispatch(
        deleteChatUser({
          myId: ENV.userid,
          oppId: user.userid,
        }),
      );
    }
  };

  const getBadgeCount = () => {
    return user.unread;
  };

  const isBagde = () => {
    return user.unread != 0;
  };

  return (
    <Menu>
      <MenuTrigger
        triggerOnLongPress
        onAlternativeAction={() => {
          navigation.navigate('Chatting', {
            userid: user.userid,
            username: user.nickname,
          });
        }}>
        <View style={styles.container}>
          <View>
            <Image
              source={Util.getThumbImage(imageUri, true)}
              style={[Themes.avatar_small]}
            />
            {isBagde() && (
              <Badge
                status="error"
                value={getBadgeCount()}
                containerStyle={{
                  position: 'absolute',
                  top: -4,
                  left: 24,
                }}
              />
            )}
          </View>
          <View style={styles.content}>
            <View style={styles.nickname_container}>
              <Text style={styles.nickname}>
                {user.nickname == 'tw_admin'
                  ? String.tw_admin
                  : user.nickname + ' '}
              </Text>
              {user.nickname == 'tw_admin' && (
                <Image
                  style={styles.vip}
                  source={require('../assets/vip.png')}
                />
              )}
            </View>
            <View style={styles.chat_container}>
              <Text style={styles.chat}>
                {user.last_type == 'I'
                  ? String.picture
                  : Util.getShrinkMsg(user.last_message, 15)}
              </Text>
              <Text style={styles.chat}>{user.updated_at}</Text>
            </View>
          </View>
        </View>
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {marginTop: 25, marginLeft: 100, borderRadius: 5},
        }}>
        <MenuOption
          value={user}
          text={`${String.chat}`}
          onSelect={() => menuHandler(user, 0)}
          customStyles={{
            optionText: {
              marginLeft: 3,
              marginVertical: 5,
              color: Colors.textColor,
            },
          }}
        />
        <MenuOption
          value={user}
          text={`${String.userProfile}`}
          onSelect={() => menuHandler(user, 1)}
          customStyles={{
            optionText: {
              marginLeft: 3,
              marginVertical: 5,
              color: Colors.textColor,
            },
          }}
        />
        <MenuOption
          value={user}
          text={`${String.delete}`}
          onSelect={() => menuHandler(user, 2)}
          customStyles={{
            optionText: {
              marginLeft: 3,
              marginVertical: 5,
              color: Colors.textColor,
            },
          }}
        />
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.gray,
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    marginLeft: 16,
    marginRight: 0,
  },
  nickname_container: {
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  nickname: {
    fontSize: 16,
    color: Colors.blue,
  },
  chat_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chat: {
    fontSize: 12,
    color: Colors.textColor,
  },
  vip: {
    width: 40,
    height: 16,
    marginLeft: 3,
    borderRadius: 5,
  },
});

export default ChatListItem;
