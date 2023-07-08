import React, {useState, useEffect} from 'react';
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
import Colors from '../constants/Colors';
import {setFollowTag} from '../store/features/tagsSlice';
import {Themes} from '../utils/Theme';

const LIMIT = 14;

const TAGS = [
  {
    tag: {
      tag_name: String.tag,
      follow: [],
    },
  },
  {
    tag: {
      tag_name: String.tag,
      follow: [],
    },
  },
  {
    tag: {
      tag_name: String.tag,
      follow: [],
    },
  },
];

const TagArrays = ({post, is_req, brief}) => {
  const [renderTags, setRenderTags] = useState(brief ? TAGS : []);
  const navigation = useNavigation();
  const [more, setMore] = useState(false);
  const [active, setActive] = useState(null);
  const dispatch = useDispatch();

  const tagList = brief
    ? post.relation?.filter(function (item) {
        return item.is_req == is_req;
      }) || []
    : post.relation?.filter(function (item) {
        return item.is_req == is_req;
      });

  useEffect(() => {
    if (tagList.length < 1) return;
    let mounted = true;
    //console.log('tagList:', JSON.stringify(tagList, null, 2));
    if (brief) {
      let count = 0;
      let i = 0;
      for (; i < tagList.length; i++) {
        count = count + tagList[i]?.tag.tag_name?.length;
        if (count > LIMIT) break;
      }
      const tags = tagList.slice(0, i);
      mounted && setRenderTags(tags);
      mounted && setMore(i < tagList.length);
    } else {
      mounted && setRenderTags(tagList);
    }

    return () => {
      mounted = false;
    };
  }, [post.relation]);

  const _itemClick = tag_name => {
    navigation.push('TagPosts', {tag: tag_name, type: 'allTags'});
  };

  const menuHandler = async (tag_id, tag_name, follow_mode) => {
    dispatch(setFollowTag({tag_id, tag_name, follow_mode}));
  };

  const isFollowTag = follow => {
    //console.log('follow1 --> ', JSON.stringify(follow, null, 2));
    return follow.length != 0;
  };

  return (
    <View style={brief ? styles.viewBriefStyle : styles.viewStyle}>
      {renderTags.map((item, index) => (
        <View
          key={index}
          style={[
            Themes.tagRect,
            {backgroundColor: is_req ? Colors.reqTag : Colors.srvTag},
            active === item.tag.tag_name ? styles.active : null,
          ]}>
          <Menu onClose={() => setActive(null)}>
            <MenuTrigger
              triggerOnLongPress
              onPress={() => setActive(item.tag.tag_name)}
              onAlternativeAction={() => _itemClick(item.tag.tag_name)}>
              <Text style={Themes.tagText}>{item.tag.tag_name}</Text>
            </MenuTrigger>
            {!isFollowTag(item.tag.follow) && (
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    marginTop: 25,
                    marginLeft: 20,
                    borderRadius: 5,
                  },
                }}>
                <MenuOption
                  value={item.tag.tag_name}
                  text={`${String.setFollow_all}`}
                  onSelect={() =>
                    menuHandler(item.tag.id, item.tag.tag_name, 2)
                  }
                  customStyles={{
                    optionText: {
                      marginLeft: 3,
                      marginVertical: 5,
                      color: Colors.textColor,
                    },
                  }}
                />
                <MenuOption
                  value={item.tag.tag_name}
                  text={`${String.setFollow_srv}`}
                  onSelect={() =>
                    menuHandler(item.tag.id, item.tag.tag_name, 0)
                  }
                  customStyles={{
                    optionText: {
                      marginLeft: 3,
                      marginVertical: 5,
                      color: Colors.textColor,
                    },
                  }}
                />
                <MenuOption
                  value={item.tag.tag_name}
                  text={`${String.setFollow_req}`}
                  onSelect={() =>
                    menuHandler(item.tag.id, item.tag.tag_name, 1)
                  }
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
            {isFollowTag(item.tag.follow) && (
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    marginTop: 25,
                    marginLeft: 20,
                    borderRadius: 5,
                  },
                }}>
                <MenuOption
                  value={item.tag.tag_name}
                  text={`${String.setFollow_cancel}`}
                  onSelect={() =>
                    menuHandler(item.tag.id, item.tag.tag_name, -1)
                  }
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
          </Menu>
        </View>
      ))}
      {brief && more && (
        <View
          style={[
            Themes.tagRect,
            {backgroundColor: is_req ? Colors.reqTag : Colors.srvTag},
          ]}>
          <Text numberOfLines={1} style={Themes.tagText}>
            ...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  viewBriefStyle: {
    flex: 1,
    flexDirection: 'row',
  },
  viewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  active: {
    opacity: 0.5,
  },
});

export default TagArrays;
