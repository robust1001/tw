import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import AllTagsTab from './AllTagsTab';
import SrvTagsTab from './SrvTagsTab';
import ReqTagsTab from './ReqTagsTab';
import String from '../../constants/String';

const TagScreen = props => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen name={String.all} component={AllTagsTab} />
      <Tab.Screen name={String.srv} component={SrvTagsTab} />
      <Tab.Screen name={String.req} component={ReqTagsTab} />
    </Tab.Navigator>
  );
};

export default TagScreen;
