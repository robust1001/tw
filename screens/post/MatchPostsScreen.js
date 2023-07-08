import React from 'react';
import {View} from 'react-native';
import Header from '../../components/Header';
import PostList from '../../components/PostList';

const MatchPostsScreen = props => {
  const {route} = props;
  return (
    <View style={{flex: 1}}>
      <Header back />
      <PostList screen={'matchPosts'} taskid={route.params.taskid} />
    </View>
  );
};

export default MatchPostsScreen;
