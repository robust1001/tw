import React from 'react';
import {View, FlatList} from 'react-native';
import {useDispatch} from 'react-redux';
import {StackActions} from '@react-navigation/native';

import ListItem from '../../components/ListItem';
import jobData from '../../assets/job';
import {updateUserProfile} from '../../store/features/userSlice';
import Header from '../../components/Header';

const JobScreen = props => {
  const dispatch = useDispatch();

  const handler = async item => {
    dispatch(updateUserProfile({job: item.name}));

    const popAction = StackActions.pop(1);
    props.navigation.dispatch(popAction);
  };

  return (
    <View>
      <Header back />
      <FlatList
        data={jobData}
        numColumns={1}
        keyExtractor={item => {
          return item.id;
        }}
        renderItem={({item}) => (
          <ListItem item={item} onPress={() => handler(item)} />
        )}
      />
    </View>
  );
};

export default JobScreen;
