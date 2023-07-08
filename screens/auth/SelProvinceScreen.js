import React, {useState} from 'react';
import {View, FlatList} from 'react-native';

import ListItem from '../../components/ListItem';
import data from '../../assets/provinces';
import Header from '../../components/Header';

const SelProvinceScreen = props => {
  const {route} = props;
  const [login, setMode] = useState(route.params.login);

  const handler = item => {
    props.navigation.navigate(login ? 'SelCityAuth' : 'SelCity', {
      login: login,
      id: item.id,
      state: item.name,
    });
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
          <ListItem item={item} expand onPress={() => handler(item)} />
        )}
      />
    </View>
  );
};

export default SelProvinceScreen;
