import React, {useEffect, useRef} from 'react';
import {Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {addChat, fetchChatUserAndNotiList} from '../store/features/chatSlice';

//Auth
import PhoneBindingScreen from '../screens/auth/PhoneBindingScreen';
import PhoneLoginScreen from '../screens/auth/PhoneLoginScreen';
import PswdLoginScreen from '../screens/auth/PswdLoginScreen';
import SelLoginModeScreen from '../screens/auth/SelLoginModeScreen';
import SelProvinceScreen from '../screens/auth/SelProvinceScreen';
import SelCityScreen from '../screens/auth/SelCityScreen';

import MyProfileScreen from '../screens/user/MyProfileScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';
import SettingsScreen from '../screens/user/SettingsScreen';
import AccountScreen from '../screens/user/AccountScreen';
import VIPScreen from '../screens/user/VIPScreen';
import AboutScreen from '../screens/user/AboutScreen';
import WebPageScreen from '../screens/user/WebPageScreen';
import FeedBackScreen from '../screens/user/FeedBackScreen';
import JobScreen from '../screens/user/JobScreen';
import PosScreen from '../screens/user/PosScreen';
import SetPswdScreen from '../screens/user/SetPswdScreen';
import NicknameScreen from '../screens/user/NicknameScreen';
import NotificationScreen from '../screens/user/NotificationScreen';

import EditPostScreen from '../screens/post/EditPostScreen';
import PostsScreen from '../screens/post/PostsScreen';
import MatchPostsScreen from '../screens/post/MatchPostsScreen';
import TagPostsScreen from '../screens/post/TagPostsScreen';
import PostDetailScreen from '../screens/post/PostDetailScreen';
import TagScreen from '../screens/tag/TagScreen';

import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import String from '../constants/String';
import ENV from '../env';
import {Context} from '../context';
import {
  updateChatStatus,
  fetchNotifications,
  updateNotification,
} from '../store/features/chatSlice';

const Stack = createStackNavigator();

const AuthStack = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <SafeAreaView style={{flex: 1}} edges={['top']}>
      <AuthStack.Navigator>
        <AuthStack.Screen
          name="SelLoginModeAuth"
          component={SelLoginModeScreen}
        />
        <AuthStack.Screen
          name="PhoneBindingAuth"
          component={PhoneBindingScreen}
        />
        <AuthStack.Screen name="PhoneLoginAuth" component={PhoneLoginScreen} />
        <AuthStack.Screen name="PswdLoginAuth" component={PswdLoginScreen} />
        <AuthStack.Screen
          name="SelProvinceAuth"
          component={SelProvinceScreen}
        />
        <AuthStack.Screen name="SelCityAuth" component={SelCityScreen} />
      </AuthStack.Navigator>
    </SafeAreaView>
  );
};

const Tab = createBottomTabNavigator();

export const BottomNavigator = () => {
  const userList = useSelector(state => state.chat.userList);
  const noread_count = useSelector(state => state.chat.noread_count);

  const getChatBadgeCount = () => {
    let unread = 0;
    for (i = 0; i < userList.length; i++) unread += userList[i].unread;
    return unread;
  };

  const isChatBadge = () => {
    let unread = 0;
    for (i = 0; i < userList.length; i++) unread += userList[i].unread;
    return unread != 0;
  };

  // const getNotifBadgeCount = () => {
  //   return noread_count;
  // };

  // const isNotifBagde = () => {
  //   return noread_count > 0;
  // };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color}) => {
          let iconName;
          let size = 24;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Tags':
              iconName = 'pricetags';
              break;
            case 'EditPost':
              iconName = 'add-circle';
              size = 32;
              break;
            case 'Chat':
              iconName = 'chatbubbles';
              break;
            default:
              iconName = 'person';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarLabel: () => {
          switch (route.name) {
            case 'Home':
              return <Text>{String.home}</Text>;
            case 'Tags':
              return <Text>{String.tag}</Text>;
            case 'EditPost':
              return <Text>{String.post}</Text>;
            case 'Chat':
              return <Text>{String.chat}</Text>;
            default:
              return <Text>{String.my}</Text>;
          }
        },
      })}>
      <Tab.Screen name="Home" component={PostsScreen} />
      <Tab.Screen name="Tags" component={TagScreen} />
      <Tab.Screen name="EditPost" component={EditPostScreen} />
      <Tab.Screen
        name="Chat"
        component={ChatListScreen}
        options={{tabBarBadge: isChatBadge() ? getChatBadgeCount() : null}}
      />
      <Tab.Screen
        name="Profile"
        component={MyProfileScreen}
        // options={{tabBarBadge: isNotifBagde() ? getNotifBadgeCount() : null}}
      />
    </Tab.Navigator>
  );
};

const MainStack = createStackNavigator();

const MainNavigator = () => {
  // const inRoom = useSelector(state => state.chat.inRoom);

  const ws = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      dispatch(fetchChatUserAndNotiList());
      // dispatch(fetchNotifications());
    }
    console.log('MainNavigator: ', MainNavigator);
    fetchData();

    initSocket();

    return () => {
      console.log('disconnected chat server');
      if (ws.current) ws.current.close();
    };
  }, []);

  const initSocket = () => {
    if (ws.current) return;
    console.log('-------socket initialize-----');

    const uri = ENV.urlChat + '?myId=' + ENV.userid;
    ws.current = new WebSocket(uri);
    ws.current.onopen = () => {
      console.log('connected chat server');
    };
    ws.current.onmessage = e => {
      const msg = JSON.parse(e.data);
      console.log('msg:', JSON.stringify(msg, null, 2));
      // console.log('ENV.inRoom:', ENV.inRoom);
      if (msg['msgtype'] == 'chat') {
        if (ENV.inRoom) {
          dispatch(addChat(msg));
        }
        dispatch(updateChatStatus(msg));
      } else {
        // notification
        dispatch(updateNotification(msg));
      }
    };
    ws.current.onerror = e => {
      console.log('socket error: ', e);
      ws.current = null;

      setTimeout(() => {
        initSocket();
      }, 5000);
    };
    ws.current.onclose = e => {
      console.log('socket close: ', e);
    };
  };

  return (
    <Context.Provider value={ws}>
      <SafeAreaView style={{flex: 1}} edges={['top']}>
        <MainStack.Navigator
          screenOptions={{headerShown: false, animationEnabled: true}}>
          <MainStack.Screen name="Main" component={BottomNavigator} />
          {/* Posts Page */}
          <MainStack.Screen name="MyProfile" component={MyProfileScreen} />
          <MainStack.Screen name="UserProfile" component={UserProfileScreen} />
          <MainStack.Screen name="PostDetail" component={PostDetailScreen} />
          <MainStack.Screen name="MatchPosts" component={MatchPostsScreen} />
          <MainStack.Screen name="TagPosts" component={TagPostsScreen} />
          {/* Settings Page */}
          <MainStack.Screen name="Settings" component={SettingsScreen} />
          <MainStack.Screen name="Account" component={AccountScreen} />
          <MainStack.Screen name="FeedBack" component={FeedBackScreen} />
          <MainStack.Screen name="About" component={AboutScreen} />
          <MainStack.Screen name="WebPage" component={WebPageScreen} />
          <MainStack.Screen name="VIP" component={VIPScreen} />
          <MainStack.Screen name="Nickname" component={NicknameScreen} />
          <MainStack.Screen
            name="Notification"
            component={NotificationScreen}
          />
          {/* Account Page */}
          <MainStack.Screen
            name="PhoneBinding"
            component={PhoneBindingScreen}
          />
          <MainStack.Screen name="SetPswd" component={SetPswdScreen} />
          <MainStack.Screen name="Job" component={JobScreen} />
          <MainStack.Screen name="Pos" component={PosScreen} />
          <MainStack.Screen name="SelProvince" component={SelProvinceScreen} />
          <MainStack.Screen name="SelCity" component={SelCityScreen} />
          {/* Chat Page */}
          <MainStack.Screen name="Chatting" component={ChatScreen} />
        </MainStack.Navigator>
      </SafeAreaView>
    </Context.Provider>
  );
};

export default MainNavigator;
