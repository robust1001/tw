import React from 'react';
import {View, Text} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import String from '../constants/String';
import {fetchPosts} from '../store/features/postsSlice';
import Colors from '../constants/Colors';

const MenuItem = tag => {
  const dispatch = useDispatch();

  const handler = async mode => {
    dispatch(
      fetchPosts({
        screen: 'tagPosts',
        page: 0,
        tag: tag.tag,
        tagtype: mode,
      }),
    );
  };

  return (
    <Menu>
      <MenuTrigger>
        <Ionicons
          name="ellipsis-vertical-outline"
          size={24}
          color={'#666'}
          style={{padding: 5, marginRight: 5}}
        />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            borderRadius: 5,
          },
        }}>
        <View>
          <MenuOption
            onSelect={() => handler('allTags')}
            customStyles={{
              optionText: {
                marginLeft: 3,
                marginVertical: 5,
                color: Colors.textColor,
              },
            }}>
            <View>
              <Text style={{padding: 5, fontSize: 16, color: '#666'}}>
                {String.allTags}
              </Text>
            </View>
          </MenuOption>
          <MenuOption
            onSelect={() => handler('srvTags')}
            customStyles={{
              optionText: {
                marginLeft: 3,
                marginVertical: 5,
                color: Colors.textColor,
              },
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{padding: 5, fontSize: 16, color: '#666'}}>
                {String.srvTags}
              </Text>
            </View>
          </MenuOption>
          <MenuOption
            onSelect={() => handler('reqTags')}
            customStyles={{
              optionText: {
                marginLeft: 3,
                marginVertical: 5,
                color: Colors.textColor,
              },
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{padding: 5, fontSize: 16, color: '#666'}}>
                {String.reqTags}
              </Text>
            </View>
          </MenuOption>
        </View>
      </MenuOptions>
    </Menu>
  );
};

export default MenuItem;
