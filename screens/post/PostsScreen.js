import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import AllPostsTab from './AllPostsTab';
import FollowostsTab from './FollowPostsTab';
import FavPostsTab from './FavPostsTab';
import String from '../../constants/String';

const PostsScreen = props => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator screenOptions={{swipeEnabled: false}}>
      <Tab.Screen name={String.recommend} component={AllPostsTab} />
      <Tab.Screen name={String.follow} component={FollowostsTab} />
      <Tab.Screen name={String.favorite} component={FavPostsTab} />
    </Tab.Navigator>
  );
};

export default PostsScreen;
