import React, {useRef} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Util from '../utils/Util';
import Colors from '../constants/Colors';
import ENV from '../env';
import String from '../constants/String';
import TagArrays from './TagArrays';
import PostToolbar from './PostToolbar';
import {Themes} from '../utils/Theme';

const PostItem = ({post, index, screen}) => {
  const navigation = useNavigation();
  const refContent = useRef();

  // if (post.id === 198 || post.id === 184) {
  //   console.log('-post-:' + screen + ':' + JSON.stringify(post, null, 2));
  // }

  const enterDetail = async postid => {
    navigation.push('PostDetail', {postid});
  };

  return (
    <View style={styles.card}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(Util.getProfilePageTitle(post.user_id), {
              userId: post.user_id,
            })
          }>
          <Image
            style={Themes.avatar_small}
            source={Util.getThumbImage(post.user?.logo, true)}
          />
        </TouchableOpacity>
        <View style={styles.body}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text
                numberOfLines={1}
                style={styles.nickname}
                onPress={() =>
                  navigation.navigate(Util.getProfilePageTitle(post.user_id), {
                    userId: post.user_id,
                  })
                }>
                {post.user?.nickname !== ''
                  ? post.user?.nickname
                  : post.user?.twid}
              </Text>
            </View>
            <PostToolbar
              myId={ENV.userid}
              postUserId={post.user_id}
              post={post}
            />
          </View>
          <TouchableOpacity onPress={() => enterDetail(post.id)}>
            <Text numberOfLines={1} style={styles.title}>
              {post.title}
            </Text>
            <View>
              <Text
                ref={refContent}
                numberOfLines={3}
                style={styles.description}>
                {' '}
                {post.content}{' '}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.tagContainer}>
            <Text style={styles.tagTitle}>{String.services}</Text>
            <TagArrays post={post} is_req={0} brief={true} />
          </View>
          <View style={styles.tagContainer}>
            <Text style={styles.tagTitle}>{String.requests}</Text>
            <TagArrays post={post} is_req={1} brief={true} />
          </View>
          <View>
            <Text style={styles.title}></Text>
            <View style={styles.timeIcon}>
              <Ionicons
                name="time-outline"
                size={16}
                style={{marginRight: 3}}
              />
              <Text>
                {Util.timeDifference(Util.nowTime(), post.created_at)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingLeft: 12,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderColor: Colors.gray,
  },
  body: {
    paddingLeft: 5,
    paddingRight: 5,
    flex: 1,
  },
  nickname: {
    fontSize: 14,
    color: Colors.blue,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',

    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textColor,
    marginBottom: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagTitle: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeIcon: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
  },
});

export default React.memo(PostItem);
