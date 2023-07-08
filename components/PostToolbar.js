import React, {useState, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Badge} from 'react-native-elements';

import Weixin from '../utils/Weixin';
import String from '../constants/String';
import {deletePost, setFavoritePost} from '../store/features/postsSlice';
import WechatShare from '../components/WechatShare';
import Colors from '../constants/Colors';
import ENV from '../env';
import Util from '../utils/Util';

const PostToolbar = ({myId, postUserId, post}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const userList = useSelector(state => state.chat.userList);

  const isFavorite =
    post.favorite.length > 0 &&
    post.favorite.findIndex(item => item.user_id == myId) !== -1;
  const isMyPost = myId == postUserId;
  // if (post.id === 210) {
  //   console.log('post ===> ', JSON.stringify(post, null, 2));
  // }

  const removePost = async id => {
    dispatch(deletePost(id));
  };

  const favoritePost = async (taskid, isFavorite) => {
    dispatch(
      setFavoritePost({
        taskId: taskid,
        favorite: isFavorite,
        post,
      }),
    );
  };

  const menuHandler = (index, isFavorite) => {
    switch (index) {
      case 0: //fav
        favoritePost(post.id, isFavorite);
        break;
      case 1: //baojing
        navigation.navigate('FeedBack', {
          type: 'post_report',
          otherId: postUserId,
          taskId: post.id,
        });
        break;
      case 2: //chatting
        // console.log('post ----> ', JSON.stringify(post, null, 2));
        navigation.navigate('Chatting', {
          userid: post.user_id,
          username: post.user.nickname,
        });
        break;
      case 3: //sharing
        refRBSheet.current.open();
        break;
      case 4:
        navigation.navigate('MatchPosts', {taskid: post.id});
        break;
      case 5: //delete tasks
        Alert.alert('', String.areYouSureDeletePost, [
          {
            text: String.cancel,
            style: 'cancel',
          },
          {
            text: String.confirm,
            onPress: () => removePost(post.id),
          },
        ]);
        break;
    }
  };

  const share = async mode => {
    refRBSheet.current.close();
    if (mode == 0) {
      console.log('share0');
      await Weixin.wxShareToSessionHandler(
        post.title,
        post.content,
        'https://i.loli.net/2019/09/03/62FauzAY37gsEXV.png',
        'news',
        ENV.urlWeb + '/task/' + post.id,
      );
    } else if (mode == 1) {
      console.log('share1');
      await Weixin.wxShareToMomentHandler(
        post.title,
        post.content,
        'https://i.loli.net/2019/09/03/62FauzAY37gsEXV.png',
        'news',
        ENV.urlWeb + '/task/' + post.id,
      );
    }
  };

  const isBagde = () => {
    if (isMyPost) return;
    const oppIndex = userList.findIndex(item => item.userid == postUserId);
    if (oppIndex == -1) return;
    return userList[oppIndex].unread != 0;
  };

  return (
    <>
      <View style={{display: 'flex', flexDirection: 'row'}}>
        {!isMyPost && (
          <>
            <TouchableOpacity
              style={styles.topButton}
              onPress={() => menuHandler(0, !isFavorite)}>
              <MaterialIcons
                style={styles.icon}
                name={isFavorite ? 'favorite' : 'favorite-outline'}
                color={isFavorite ? 'red' : null}
                size={18}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.topButton}
              onPress={() => menuHandler(1)}>
              <Ionicons style={styles.icon} name="warning-outline" size={18} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.topButton}
              onPress={() => menuHandler(2)}>
              <Ionicons
                style={styles.icon}
                name="chatbubble-ellipses-outline"
                size={18}
              />
              {isBagde() && (
                <Badge
                  status="error"
                  // value={getBadgeCount()}
                  containerStyle={{
                    position: 'absolute',
                    top: 0,
                    left: 12,
                  }}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.topButton}
              onPress={() => menuHandler(3)}>
              <Ionicons
                style={styles.icon}
                name="share-social-outline"
                size={18}
              />
            </TouchableOpacity>
          </>
        )}
        {isMyPost && (
          <>
            <TouchableOpacity
              style={styles.topButton}
              onPress={() => menuHandler(4)}>
              <Ionicons
                style={styles.icon}
                name="git-compare-outline"
                size={18}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity
                style={styles.topButton}
                onPress={() => menuHandler(6)}>
                  <Ionicons
                    style={styles.icon}
                    name="create-outline"
                    size={18}
                  />
              </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.topButton}
              onPress={() => menuHandler(5)}>
              <Ionicons style={styles.icon} name="trash-outline" size={18} />
            </TouchableOpacity>
          </>
        )}
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={160}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <WechatShare share={mode => share(mode)} />
      </RBSheet>
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 25,
    height: 25,
  },
});

export default PostToolbar;
