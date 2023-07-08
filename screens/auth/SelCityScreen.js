import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import ListItem from '../../components/ListItem';
import cityData from '../../assets/cities';
import {updateUserProfile} from '../../store/features/userSlice';
import {setAuthenticate} from '../../store/features/authSlice';
import ENV from '../../env';
import Header from '../../components/Header';

const SelCityScreen = props => {
  const {route} = props;
  const [data, setData] = useState(null);
  const [state, setState] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const init = () => {
      setData(cityData.filter(x => x.parentId == route.params.id));
      setState(route.params.state);
    };
    init();
  }, []);

  const handler = async item => {
    dispatch(updateUserProfile({location: state + '/' + item.name}));

    if (route.params.login) {
      dispatch(setAuthenticate({user: ENV.userid, token: ENV.token}));
    } else {
      const popAction = StackActions.pop(2);
      props.navigation.dispatch(popAction);
    }
  };

  return (
    <View>
      <Header back />
      <FlatList
        data={data}
        numColumns={1}
        keyExtractor={item => {
          return item.id;
        }}
        renderItem={({item}) => (
          <ListItem item={item} expand={false} onPress={() => handler(item)} />
        )}
      />
    </View>
  );
};

export default SelCityScreen;
