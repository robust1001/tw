import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {useDispatch} from 'react-redux';

import String from '../constants/String';
import {setFollowTag} from '../store/features/tagsSlice';
import Colors from '../constants/Colors';

const TagItem = props => {
  //const TagItem = ({tag, tag_name, follow, screen}) => {
  const {tag, screen} = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [active, setActive] = useState(null);

  // console.log('tag:', JSON.stringify(tag, null, 2));

  const _itemClick = () => {
    console.log('_itemClick:' + tag.tag_name + ', ' + screen);
    navigation.navigate('TagPosts', {tag: tag.tag_name, type: screen});
  };

  const menuHandler = async follow_mode => {
    dispatch(
      setFollowTag({
        tag_id: tag.id,
        tag_name: tag.tag_name,
        follow_mode,
      }),
    );
  };

  const isFollowTag = () => {
    return tag.follow != null && tag.follow.length != 0;
  };

  return (
    <Menu onClose={() => setActive(null)}>
      <MenuTrigger
        triggerOnLongPress
        onPress={() => setActive(tag.tag_name)}
        onAlternativeAction={() => _itemClick()}>
        <View style={styles.container}>
          <Text
            style={[
              styles.item,
              active === tag.tag_name ? styles.active : null,
            ]}>
            {tag.tag_name}
          </Text>
        </View>
      </MenuTrigger>
      {!isFollowTag() && (
        <MenuOptions
          customStyles={{
            optionsContainer: {
              marginTop: 25,
              marginLeft: 20,
              borderRadius: 5,
            },
          }}>
          <MenuOption
            value={tag.tag_name}
            text={`${String.setFollow_all}`}
            onSelect={() => menuHandler(2)}
            customStyles={{
              optionText: {
                marginLeft: 3,
                marginVertical: 5,
                color: Colors.textColor,
              },
            }}
          />
          <MenuOption
            value={tag.tag_name}
            text={`${String.setFollow_srv}`}
            onSelect={() => menuHandler(0)}
            customStyles={{
              optionText: {
                marginLeft: 3,
                marginVertical: 5,
                color: Colors.textColor,
              },
            }}
          />
          <MenuOption
            value={tag.tag_name}
            text={`${String.setFollow_req}`}
            onSelect={() => menuHandler(1)}
            customStyles={{
              optionText: {
                marginLeft: 3,
                marginVertical: 5,
                color: Colors.textColor,
              },
            }}
          />
        </MenuOptions>
      )}
      {isFollowTag() && (
        <MenuOptions
          customStyles={{optionsContainer: {marginTop: 25, marginLeft: 20}}}>
          <MenuOption
            value={tag.tag_name}
            text={`${String.setFollow_cancel}`}
            onSelect={() => menuHandler(-1)}
            customStyles={{
              optionText: {
                marginVertical: 5,
                color: Colors.textColor,
              },
            }}
          />
        </MenuOptions>
      )}
    </Menu>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: Colors.gray,
  },
  item: {
    color: Colors.textColor,
  },
  active: {
    backgroundColor: '#00000020',
  },
});

export default React.memo(TagItem);
