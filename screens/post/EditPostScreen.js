import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import InputItem from '../../components/InputItem';
import AddImageItem from '../../components/AddImageItem';
import TagEditItem from '../../components/TagEditItem';
import Colors from '../../constants/Colors';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Util from '../../utils/Util';
import ENV from '../../env';
import String from '../../constants/String';
import {createPost} from '../../store/features/postsSlice';
import Header from '../../components/Header';
import {Themes} from '../../utils/Theme';

const EditPostScreen = props => {
  const {route} = props;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [clearImgs, setClearImgs] = useState(false);
  const period = [String.one_month, String.two_month, String.three_month];
  const [tagSrvList, setTagSrvList] = useState([]);
  const [tagReqList, setTagReqList] = useState([]);
  const [expireStr, setExpireStr] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [clear, setClear] = useState(0);
  const refDropdown = useRef();
  const dispatch = useDispatch();
  const expire_date = useSelector(state => state.user.expire_date);
  const vip = Util.isVIP(expire_date);

  useEffect(() => {
    setTitle('');
    setContent('');
    setTagSrvList([]);
    setTagReqList([]);
    setImageList([]);
    periodHandler(0);
  }, []);

  const initialize = () => {
    setTitle('');
    setContent('');
    setClearImgs(true);
    //setExpireStr('');
    periodHandler(0);
    setClear(clear + 1);
    //refDropdown.current.reset();
  };

  const validatePost = () => {
    if (!title || title.length === 0) {
      Util.showMessage(String.pleaseInputPostTitle);
      return false;
    }
    if (title.length < 2 || title.length > 30) {
      Util.showMessage(String.PostTitleLenth);
      return false;
    }
    if (!content || content.length === 0) {
      Util.showMessage(String.pleaseInputPostContent);
      return false;
    }
    if (content.length < 5 || content.length > 200) {
      Util.showMessage(String.PostContentLength);
      return false;
    }
    if (tagSrvList.length == 0 && tagReqList.length == 0) {
      Util.showMessage(String.tagCount);
      return false;
    }
    if (!expireStr || expireStr.length === 0) {
      Util.showMessage(String.pleaseInputExpire);
      return false;
    }
    return true;
  };

  const imagePickedHandler = list => {
    console.log('imagelist:', list);
    setImageList(list);
    setClearImgs(false);
  };

  const TagTakenHandler1 = list => {
    setTagSrvList(list);
  };

  const TagTakenHandler2 = list => {
    setTagReqList(list);
  };

  const getExpireMonth = index => {
    let month = 0;
    if (index == 0) {
      month = 1;
    } else if (index == 1) {
      month = 2;
    } else if (index == 2) {
      month = 3;
    }
    return month;
  };

  const getExpireDate = index => {
    const today = Util.nowTime();
    let month = getExpireMonth(index);
    let date = new Date(today.setMonth(today.getMonth() + month));
    return date;
  };

  const periodHandler = index => {
    let month = getExpireMonth(index);
    const today = Util.nowTime();
    let date = new Date(today.setMonth(today.getMonth() + month));
    let ret =
      Util.strFormat(
        String.date,
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
      ) + String.expire;
    setExpireStr(ret);
    setExpireDate(getExpireDate(index));
  };

  const postHandler = async () => {
    if (validatePost()) {
      setIsLoading(true);
      try {
        await dispatch(
          createPost({
            title,
            content,
            images: imageList,
            service_tags: tagSrvList,
            request_tags: tagReqList,
            deadline: expireDate,
          }),
        );
        initialize();
        setIsLoading(false);
        Util.showMessage(String.sendPostSuccess);
      } catch (e) {
        console.log(e);
        Util.showMessage(String.sendPostFailed);
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header title={String.editPost} />
      <ScrollView>
        <View style={styles.screen} behavior="padding">
          <InputItem
            title={String.postTitle}
            value={title}
            onChangeText={text => setTitle(text)}
            placeholder={String.pleaseInputPostTitle1}
            maxLength={30}
            lines={2}
          />
          <InputItem
            title={String.detailContent}
            value={content}
            onChangeText={text => setContent(text)}
            placeholder={String.pleaseInputPostContent1}
            maxLength={200}
            lines={9}
          />
          <AddImageItem
            onImageTaken={imagePickedHandler}
            maxCount={3}
            clearImgs={clear}
          />
          <TagEditItem
            title={String.services}
            isServ="true"
            placeholder={String.inputTagMethod}
            maxLength={50}
            onTagTaken={TagTakenHandler1}
            clear={clear}
            initData={tagSrvList}
          />
          <TagEditItem
            title={String.requests}
            isServ="false"
            placeholder={String.inputTagMethod}
            maxLength={50}
            onTagTaken={TagTakenHandler2}
            clear={clear}
            initData={tagReqList}
          />
          <View style={styles.expireLine}>
            <View style={{flex: 1}}>
              <SelectDropdown
                ref={refDropdown}
                data={period}
                //defaultButtonText={String.pleaseInputExpire}
                defaultValueByIndex={0}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                  return periodHandler(index);
                }}
                disabled={ENV.vipMode && !vip}
                buttonStyle={styles.dropdownBtnStyle}
                buttonTextStyle={styles.dropdownBtnTxtStyle}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item;
                }}
                renderDropdownIcon={() => {
                  return (
                    <FontAwesome name="chevron-down" color={'#444'} size={18} />
                  );
                }}
                dropdownIconPosition={'right'}
                rowTextStyle={styles.dropdownRowTxtStyle}
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={[Themes.text, {marginLeft: 8}]}>{expireStr}</Text>
            </View>
          </View>
          {ENV.vipMode && !vip && (
            <TouchableOpacity onPress={() => props.navigation.navigate('VIP')}>
              <Text style={styles.expireNotify}>
                {String.notify_set_post_expire}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={Themes.button} onPress={() => postHandler()}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={Themes.buttonText}>{String.post}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    marginTop: 0,
    paddingHorizontal: 20,
  },
  expireNotify: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.hypelink,
    paddingHorizontal: 6,
  },
  dropdownBtnStyle: {
    width: '100%',
    height: 40,
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  dropdownBtnTxtStyle: {
    color: Colors.textColor,
    textAlign: 'left',
    fontSize: 16,
  },
  dropdownRowTxtStyle: {
    color: Colors.textColor,
    textAlign: 'left',
    fontSize: 16,
  },
  expireLine: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
});

export default EditPostScreen;
