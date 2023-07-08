import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MyPostsTab from '../post/MyPostsTab';
import FollowTagsTab from '../tag/FollowTagsTab';
import String from '../../constants/String';
import Header from '../../components/Header';
import Profile from '../../components/Profile';

const MyProfileScreen = props => {
  const routeName = props.route.name;
  const Tab = createMaterialTopTabNavigator();

  return (
    <>
      {routeName !== 'Profile' && <Header back />}
      <Profile type="my" />
      <Tab.Navigator>
        <Tab.Screen name={String.myPosts} component={MyPostsTab} />
        <Tab.Screen name={String.followTags} component={FollowTagsTab} />
      </Tab.Navigator>
    </>
  );
};

export default MyProfileScreen;
