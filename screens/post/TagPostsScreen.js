import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import PostList from '../../components/PostList';
import Header from '../../components/Header';
import String from '../../constants/String';

const TagPostsScreen = props => {
  const {route} = props;
  const [tag, setTag] = useState(route.params.tag);
  const [tagtype, setTagType] = useState(route.params.type);
  const [title, setTitle] = useState('');

  useEffect(() => {
    let title;
    switch (route.params.type) {
      case 'srvTags':
        title = String.srvTags;
        break;
      case 'reqTags':
        title = String.reqTags;
        break;
      default:
        title = String.allTags;
        break;
    }

    setTitle(title);
  }, [route.params.type]);

  return (
    <View style={{flex: 1}}>
      <Header back title={title} menu />
      <PostList screen={'tagPosts'} taskid={''} tag={tag} tagtype={tagtype} />
    </View>
  );
};

export default TagPostsScreen;
