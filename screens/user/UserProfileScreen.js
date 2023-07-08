import React from 'react';
import UserPosts from '../post/UserPosts';
import Header from '../../components/Header';
import Profile from '../../components/Profile';

const UserProfileScreen = props => {
  const {route} = props;
  return (
    <>
      <Header back />
      <Profile type="user" userid={route.params.userId} />
      <UserPosts userid={route.params.userId} />
    </>
  );
};

export default UserProfileScreen;
