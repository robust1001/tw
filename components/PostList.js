import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import PostItem from './PostItem';
import Colors from '../constants/Colors';
import String from '../constants/String';
import {fetchPosts, clearPostsByType} from '../store/features/postsSlice';
import {Themes} from '../utils/Theme';
import {useIsFocused} from '@react-navigation/native';

const PostList = ({screen, taskid, tag, tagtype, userid}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const loading = useSelector(state => state.posts.loading);
  const posts = useSelector(state => state.posts[screen]);
  const dispatch = useDispatch();
  const refPosts = useRef(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    loadPosts(0);

    return () => {
      // dispatch(clearPostsByType(screen));
    };
  }, [isFocused]);

  const loadPosts = async page => {
    switch (screen) {
      case 'allPosts':
        dispatch(fetchPosts({screen, page}));
        break;
      case 'matchPosts':
        dispatch(fetchPosts({screen, page, taskid}));
        break;
      case 'myPosts':
        dispatch(fetchPosts({screen, page}));
        break;
      case 'userPosts':
        dispatch(
          fetchPosts({
            screen,
            page,
            other: userid,
          }),
        );
        break;
      case 'tagPosts':
        dispatch(fetchPosts({screen, page, tag, tagtype}));
        break;
      case 'favPosts':
        dispatch(fetchPosts({screen, page}));
        break;
      case 'followPosts':
        dispatch(fetchPosts({screen, page}));
        break;
      default:
        break;
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    loadPosts(0);
    setIsRefreshing(false);
  };

  const onEndReached = async () => {
    if (loading) return;
    if (posts.endPage) return;
    const pageNumber = posts.lastPageNo;
    loadPosts(pageNumber);
  };

  const onKeyExtractor = item => {
    return item.id;
  };

  const onRenderItem = ({item, index}) => (
    <PostItem post={item} index={index} screen={screen} />
  );

  return (
    <View>
      {posts.list.length === 0 ? (
        <View style={styles.noitem}>
          <Text style={[Themes.text]}>{String.noPostItems}</Text>
        </View>
      ) : (
        <FlatList
          ref={refPosts}
          onRefresh={refreshData}
          refreshing={isRefreshing}
          data={posts.list}
          keyExtractor={onKeyExtractor}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.9}
          renderItem={onRenderItem}
          ListFooterComponent={
            loading && (
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            )
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  noitem: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
    // flex: 1,
  },
});

export default PostList;
