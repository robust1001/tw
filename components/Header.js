import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';
import MenuItem from './MenuItem';

const Header = ({title = '', back = false, menu = false}) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        backgroundColor: Colors.white,
        height: 50,
        paddingHorizontal: 8,
        justifyContent: 'space-between',
      }}>
      {back ? (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Ionicons name="chevron-back" size={32} />
        </TouchableOpacity>
      ) : (
        <View style={{width: 32, height: 32}} />
      )}
      <Text
        style={{
          textAlign: 'center',
          flex: 1,
          fontSize: 20,
        }}>
        {title}
      </Text>
      {menu ? (
        <MenuItem tag={route.params.tag} />
      ) : (
        <View style={{width: 32, height: 32}} />
      )}
    </View>
  );
};

export default Header;
