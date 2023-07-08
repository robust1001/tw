import React from 'react';
import {View, FlatList} from 'react-native';
import {useDispatch} from 'react-redux';
import {StackActions} from '@react-navigation/native';

import ListItem from '../../components/ListItem';
import posData from '../../assets/pos';
import {updateUserProfile} from '../../store/features/userSlice';
import Header from '../../components/Header';

const PosScreen = props => {
  const dispatch = useDispatch();
  console.log('PosScreen');

  const handler = async item => {
    console.log('POS:', item.name);
    dispatch(updateUserProfile({pos: item.name}));
    const popAction = StackActions.pop(1);
    props.navigation.dispatch(popAction);
  };

  return (
    <View style={{flex: 1}}>
      <Header back />
      <FlatList
        data={posData}
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

export default PosScreen;
