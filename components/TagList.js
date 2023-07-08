import React, {useState, useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, StyleSheet, FlatList} from 'react-native';

import TagItem from './TagItem';
import String from '../constants/String';
import {fetchAllTags} from '../store/features/tagsSlice';
import SectionSelector from './SectionSelector';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';

const TagList = ({screen, bHeader}) => {
  const tags = useSelector(state => state.tags[screen]);
  const loading = useSelector(state => state.tags.loading);
  const dispatch = useDispatch();
  const refFlatList = useRef();
  const [activeSection, setActiveSection] = useState(String.all);
  const [searchText, setSearchText] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  // console.log('tags.list.length:', tags.list.length);

  useEffect(() => {
    fetchTags(0, activeSection, '');
  }, []);

  const fetchTags = async (page, section, search) => {
    if (section == String.all) section = 'ALL';
    if (section == '#') section = 'SPEC';

    switch (screen) {
      case 'allTags':
        await dispatch(fetchAllTags({page, screen, section, search}));
        break;
      case 'srvTags':
        dispatch(fetchAllTags({page, screen, section, search}));
        break;
      case 'reqTags':
        dispatch(fetchAllTags({page, screen, section, search}));
        break;
      case 'followTags':
        dispatch(fetchAllTags({page, screen, section, search}));
        break;
      default:
        break;
    }
  };

  const _extraUniqueKey = (item, index) => {
    return 'index' + index + item;
  };

  const onEndReached = async () => {
    console.log('onEndReached');
    if (loading) return;
    if (tags.endPage) return;

    const pageNumber = tags.lastPageNo * 1 + 1;
    await fetchTags(pageNumber, activeSection, searchText);
  };

  const getItemLayout = (data, index) => ({
    length: 30,
    offset: 30 * index,
    index,
  });

  const renderItem = ({item}) => <TagItem tag={item} screen={screen} />;

  const refreshData = async () => {
    setIsRefreshing(true);
    fetchTags(0, activeSection, '');
    setIsRefreshing(false);
  };

  const sectionHandler = async section => {
    setActiveSection(section);
    try {
      await fetchTags(0, section, '');
      refFlatList.current.scrollToIndex({index: 0});
    } catch (e) {
      console.log(e);
    }
  };

  const searchHandler = async text => {
    setSearchText(text);
    await fetchTags(0, '', text);
  };

  return (
    <View style={screen == 'followTags' ? styles.container1 : styles.container}>
      {bHeader && (
        <SectionSelector
          sectionHandler={section => sectionHandler(section)}
          searchHandler={text => searchHandler(text)}
        />
      )}
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <FlatList
          ref={refFlatList}
          data={tags.list}
          horizontal={false}
          onRefresh={refreshData}
          refreshing={isRefreshing}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.7}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={_extraUniqueKey}
          getItemLayout={getItemLayout}
          style={{flex: 1}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 55,
  },
  container1: {
    padding: 10,
    paddingBottom: 0,
  },
});

export default TagList;
