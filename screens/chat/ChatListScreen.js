import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Text,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import Colors from '../../constants/Colors';
import ChatListItem from '../../components/ChatListItem';
import ENV from '../../env';
import String from '../../constants/String';
import {fetchChatUserAndNotiList} from '../../store/features/chatSlice';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';

const ChatListScreen = props => {
  let userList = useSelector(state => state.chat.userList);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);

  const dispatch = useDispatch();

  const loadChatList = useCallback(async () => {
    setIsRefreshing(true);
    try {
      dispatch(fetchChatUserAndNotiList());
    } catch (err) {
      console.log(err);
    }
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    console.log('userList: ', JSON.stringify(userList, null, 2));
    setData(userList);
  }, [userList]);

  const handleSearchTextChange = text => {
    setSearchText(text);
    //console.log('userList: ', userList.length);
    const filteredUsers = userList.filter(item => {
      const name = item.nickname;
      return name.includes(text);
    });
    setData(filteredUsers);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <Header title={String.chat} />
      <SearchBar
        hanlder={handleSearchTextChange}
        borderColor={Colors.gray1}
        textColor={Colors.textColor}
      />
      {data.length === 0 && (
        <View style={styles.centered}>
          <Text>{String.noChatHistory}</Text>
        </View>
      )}
      <FlatList
        data={data}
        refreshing={isRefreshing}
        onRefresh={loadChatList}
        keyExtractor={item => item.userid}
        renderItem={user => <ChatListItem user={user.item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatListScreen;
