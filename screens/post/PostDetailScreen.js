import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import TagArrays from '../../components/TagArrays';
import PostToolbar from '../../components/PostToolbar';
import Util from '../../utils/Util';
import ENV from '../../env';
import Colors from '../../constants/Colors';
import String from '../../constants/String';
import Header from '../../components/Header';
import {fetchPostAPI} from '../../api/posts';
import {useIsFocused} from '@react-navigation/native';

const PostDetailScreen = props => {
  const {route} = props;
  const {postid} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selImageIndex, setSelImageIndex] = useState(0);
  const [post, setPost] = useState(null);
  const isFocused = useIsFocused();
  console.log('postid: ', postid);

  useEffect(() => {
    if (!isFocused) return;
    async function fetchData() {
      const response = await fetchPostAPI({taskid: postid});
      if (response.result) setPost(response.task[0]);
    }
    fetchData();
  }, [isFocused]);

  const showImage = index => {
    setSelImageIndex(index);
    setModalVisible(true);
  };

  if (!post) {
    console.log('post detail null');
    return null;
  }

  return (
    <>
      <Header back />
      <ScrollView>
        {!modalVisible && (
          <View style={styles.card}>
            <View style={styles.rightAlign}>
              <PostToolbar
                myId={ENV.userid}
                postUserId={post.user_id}
                post={post}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate(
                    Util.getProfilePageTitle(post.user_id),
                    {userId: post.user_id},
                  )
                }>
                <Image
                  style={styles.userIcon}
                  source={Util.getThumbImage(post.user?.logo, true)}
                />
              </TouchableOpacity>
              <View style={{justifyContent: 'center', marginLeft: 5}}>
                <Text
                  style={styles.cardNicknameText}
                  onPress={() =>
                    props.navigation.navigate(
                      Util.getProfilePageTitle(post.user_id),
                      {userId: post.user_id},
                    )
                  }>
                  {post.user.nickname !== ''
                    ? post.user.nickname
                    : post.user.twid}
                </Text>
              </View>
            </View>
            <View style={styles.body}>
              <Text style={styles.title}>{post.title}</Text>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  style={{marginRight: 3}}
                />
                <Text>
                  {Util.timeDifference(Util.nowTime(), post.created_at)}
                </Text>
              </View>
              <View>
                <Text style={styles.description}> {post.content} </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View style={styles.cardImageContainer}>
                    {post.images.map((item, index) => (
                      <View key={index}>
                        <TouchableOpacity onPress={() => showImage(index)}>
                          <View style={styles.btnPict1}>
                            <View style={{position: 'relative'}}>
                              <Image
                                style={styles.img}
                                source={Util.getThumbImage(item.url)}
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                  <View style={styles.cardTagContainer}>
                    <Text style={styles.loginTitle}>{String.services}</Text>
                    <TagArrays post={post} is_req={0} brief={false} />
                  </View>
                  <View style={styles.cardTagContainer}>
                    <Text style={styles.loginTitle}>{String.requests}</Text>
                    <TagArrays post={post} is_req={1} brief={false} />
                  </View>
                </View>
              </View>
              <View style={styles.rightAlign}>
                <Text style={styles.loginTitle}>
                  {Util.changeDateFormat(post.deadline) + String.expire}
                </Text>
              </View>
            </View>
          </View>
        )}
        <Modal visible={modalVisible}>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            {post.images[selImageIndex] && (
              <Image
                style={styles.img1}
                resizeMode={'contain'}
                source={{
                  uri: ENV.urlBackend + `${post.images[selImageIndex].url}`,
                }}
              />
            )}
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  userIcon: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 30,
    marginLeft: 5,
    height: 40,
    width: 40,
  },
  card: {
    backgroundColor: 'white',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  body: {
    paddingHorizontal: 5,
  },
  cardNicknameText: {
    fontSize: 14,
    color: 'deepskyblue',
    fontWeight: 'bold',
  },
  cardImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  cardTagContainer: {
    marginVertical: 4,
  },
  /******** card components **************/
  title: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: Colors.textColor,
    marginBottom: 4,
  },
  mnButton: {
    width: 16,
    height: 16,
    marginHorizontal: 2,
  },
  time: {
    fontSize: 13,
    color: '#808080',
    marginTop: 5,
  },
  icon: {
    width: 25,
    height: 25,
  },
  btnPict1: {
    marginVertical: 10,
    marginRight: 10,
    width: 50,
    height: 50,
    backgroundColor: Colors.gray,
    borderRadius: 3,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 3,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  btnServTag: {
    backgroundColor: Colors.srvTag,
    borderRadius: 5,
    marginHorizontal: 3,
    marginTop: 2,
  },
  btnReqTag: {
    backgroundColor: Colors.reqTag,
    borderRadius: 5,
    marginHorizontal: 3,
    marginTop: 2,
  },
  loginText: {
    color: 'white',
    paddingVertical: 1,
    paddingLeft: 2,
    paddingRight: 2,
  },
  loginTitle: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    display: 'flex',
  },
  img1: {
    //flex: 1
    width: '100%',
    height: '100%',
  },
  btnDlgTitle: {
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  btnDlgButtonOK: {
    backgroundColor: 'darkturquoise',
    //borderWidth: 1,
    marginTop: 10,
    color: 'black',
    width: 200,
    height: 40,
    borderRadius: 10,
    marginBottom: 30,
  },
  btnDlgButtonCancel: {
    backgroundColor: 'gainsboro',
    //borderWidth: 1,
    marginTop: 10,
    color: 'black',
    width: 200,
    height: 40,
    borderRadius: 10,
  },
  contents: {
    textAlignVertical: 'top',
    textAlign: 'left',
    backgroundColor: '#EEE',
    //width: 400,
    borderRadius: 5,
    marginBottom: 10,
  },
  card1: {
    marginLeft: 'auto',
    marginRight: 'auto',
    alignContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 63,
    borderWidth: 2,
    borderColor: 'white',
    // marginBottom:10,
  },
  listLabel: {
    fontSize: 14,
    justifyContent: 'center',
    color: '#666',
  },
  rightAlign: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default PostDetailScreen;
