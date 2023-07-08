import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {getUserInfoAPI} from '../api/user';
import Util from '../utils/Util';
import ENV from '../env';
import Colors from '../constants/Colors';
import String from '../constants/String';
import {Themes} from '../utils/Theme';
import {useIsFocused} from '@react-navigation/native';
import {Badge} from 'react-native-elements';

const Profile = ({type, userid}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const noread_count = useSelector(state => state.chat.noread_count);
  const twid = useSelector(state => state.user.twid);
  const wechat_id = useSelector(state => state.user.wechat_id);
  const nickname = useSelector(state => state.user.nickname);
  const logo = useSelector(state => state.user.logo);
  const location = useSelector(state => state.user.location);
  const gender = useSelector(state => state.user.gender);
  const birthday = useSelector(state => state.user.birthday);
  const job = useSelector(state => state.user.job);
  const pos = useSelector(state => state.user.pos);
  const expire_date = useSelector(state => state.user.expire_date);
  const vip = Util.isVIP(expire_date);

  useEffect(() => {
    if (type != 'my' || !isFocused) return;

    const resData = {
      result: true,
      userid: ENV.userid,
      twid: twid,
      wechat_id: wechat_id,
      nickname: nickname,
      logo: logo,
      location: location,
      gender: gender,
      birthday: birthday,
      job: job,
      pos: pos,
      expire_date: expire_date,
    };
    setData(resData);
    setIsLoading(false);
  }, [isFocused]);

  useEffect(() => {
    if (type == 'my') return;

    async function fetchData() {
      const resData = await getUserInfoAPI(userid);
      if (resData.result) {
        resData.info.location = resData.info.state + '/' + resData.info.city;
        // console.log(
        //   'getUserInfo result:',
        //   JSON.stringify(resData.info, null, 2),
        // );
        setData(resData.info);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!data) return null;

  const getNotifBadgeCount = () => {
    return noread_count;
  };

  const isNotifBagde = () => {
    return noread_count > 0;
  };

  return (
    <>
      <View>
        <ImageBackground
          source={require('../assets/bg-auth.png')}
          style={styles.bgImage}>
          <View style={styles.userinfo}>
            {type == 'my' ? (
              <TouchableOpacity onPress={() => navigation.navigate('Account')}>
                <Image
                  style={[Themes.avatar_big]}
                  source={Util.getThumbImage(data.logo, true)}
                />
              </TouchableOpacity>
            ) : (
              <Image
                style={[Themes.avatar_big]}
                source={Util.getThumbImage(data.logo, true)}
              />
            )}
            <View style={styles.infoRect}>
              {type == 'my' ? (
                <View style={{display: 'flex', flexDirection: 'row-reverse'}}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Settings')}>
                    <Ionicons
                      style={styles.myicon}
                      name="settings-outline"
                      size={20}
                    />
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    onPress={() => navigation.navigate('Notification')}>
                    <Ionicons
                      style={styles.myicon}
                      name="chatbox-ellipses-outline"
                      size={20}
                    />
                    {isNotifBagde() && (
                      <Badge
                        status="error"
                        value={getNotifBadgeCount()}
                        containerStyle={{
                          position: 'absolute',
                          top: -6,
                          left: 16,
                        }}
                      />
                    )}
                  </TouchableOpacity> */}
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Chatting', {
                      userid: userid,
                      username: data.nickname,
                    })
                  }>
                  <Ionicons
                    style={styles.othericon}
                    name="chatbubble-ellipses-outline"
                    size={20}
                  />
                </TouchableOpacity>
              )}

              <View style={styles.NicknameVIP}>
                {type == 'my' ? (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Account')}>
                    <Text style={styles.nickName} numberOfLines={1}>
                      {data.nickname}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.NicknameVIP}>
                    <Text style={styles.nickName} numberOfLines={1}>
                      {data.nickname}
                    </Text>
                  </View>
                )}
                {type == 'my' && ENV.vipMode && (
                  <TouchableOpacity onPress={() => navigation.navigate('VIP')}>
                    {vip ? (
                      <Image
                        style={styles.vip}
                        source={require('../assets/vip.png')}
                      />
                    ) : (
                      <Image
                        style={styles.vip}
                        source={require('../assets/kaitongvip.png')}
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.userid}>
                {String.tengweiCode}：{data.twid}
              </Text>
              <View style={styles.itemRect}>
                {data.gender != '' && (
                  <View style={styles.item}>
                    <Text style={styles.text}>
                      {data.gender == '1' ? String.man : String.women}
                    </Text>
                  </View>
                )}
                {data.birthday !== '0000-00-00' && (
                  <View style={styles.item}>
                    <Text style={styles.text}>
                      {Util.getAge(data.birthday)}
                      {String.yearsOld}
                    </Text>
                  </View>
                )}
                {data.job !== '' && (
                  <View style={styles.item}>
                    <Text style={styles.text}>{data.job}</Text>
                  </View>
                )}
                {data.pos !== '' && (
                  <View style={styles.item}>
                    <Text style={styles.text}>{data.pos}</Text>
                  </View>
                )}
                {data.location !== '' && (
                  <View style={styles.item}>
                    <Text style={styles.text}>{data.location}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          {/* <View style={styles.profileDetail}>
            <View style={styles.detailContent}>
              <Text style={styles.title}>{String.followUsers}</Text>
              <Text>200</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.title}>{String.followMeUsers}</Text>
              <Text>200</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.title}>{String.followTags}</Text>
              <Text>200</Text>
            </View>
          </View> */}
        </ImageBackground>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  userinfo: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  bgImage: {
    padding: 10,
    paddingBottom: 15,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  infoRect: {
    flex: 1,
    marginLeft: 10,
  },
  NicknameVIP: {
    flexDirection: 'row',
    marginRight: 24,
  },
  nickName: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '600',
  },
  vip: {
    width: 40,
    height: 16,
    marginLeft: 3,
    borderRadius: 5,
  },
  userid: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
  item: {
    backgroundColor: Colors.green,
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 3,
    margin: 1,
  },
  text: {
    fontSize: 14,
    color: Colors.white,
  },
  itemRect: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  profileDetail: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  detailContent: {
    margin: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    color: Colors.white,
  },
  myicon: {
    marginLeft: 8,
    color: Colors.gray,
  },
  othericon: {
    textAlign: 'right',
    color: Colors.gray,
  },
});

export default Profile;
