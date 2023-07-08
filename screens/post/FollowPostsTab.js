import {useIsFocused} from '@react-navigation/native';
import React from 'react';
import PostList from '../../components/PostList';

const FollowPostsTab = () => {
  const isFocused = useIsFocused();
  return <PostList screen={'followPosts'} />;
};

export default FollowPostsTab;
