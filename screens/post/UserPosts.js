import React from 'react';
import PostList from '../../components/PostList';

const UserPosts = props => {
  return <PostList screen={'userPosts'} userid={props.userid} />;
};

export default UserPosts;
