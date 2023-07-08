import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Util from '../utils/Util';
import String from '../constants/String';
import {Themes} from '../utils/Theme';

const TagEditItem = props => {
  const [content, setContent] = useState(props.content);
  const [tagList, setTagList] = React.useState([]);

  useEffect(() => {
    //console.log('props.initData:', props.initData);
    setTagList(props.initData);
  }, [props.initData]);

  useEffect(() => {
    clearTags();
    setContent('');
  }, [props.clear]);

  const AddTagHandler = async () => {
    //console.log('tag:', content);
    if (tagList.length >= 5) {
      Util.showMessage(String.notifyMaxTagCount);
      return;
    }
    if (content.length < 2 || content.length > 10) {
      Util.showMessage(String.notifyTagMaxLen);
      return;
    }
    const newList = [...tagList, content];
    setTagList(newList);
    props.onTagTaken(newList);
    setContent('');
  };

  const clearTags = () => {
    setTagList([]);
  };

  const removeTag = index => {
    let tempList = [...tagList];
    tempList.splice(index, 1);
    setTagList(tempList);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <View style={styles.tagLine}>
        <TextInput
          style={styles.contents}
          onChangeText={text => setContent(text)}
          placeholder={props.placeholder}
          editable
          autoCapitalize="none"
          value={content}
          maxLength={200}
        />
        <View style={styles.addBtnContainer}>
          <TouchableOpacity style={styles.addBtn} onPress={AddTagHandler}>
            <Text style={{color: Colors.white}}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tagArray}>
        {tagList.map((item, index) => (
          <View key={index}>
            <TouchableOpacity
              style={[
                Themes.tagRect,
                {
                  backgroundColor:
                    props.isServ == 'true' ? Colors.srvTag : Colors.reqTag,
                },
              ]}>
              <View style={{position: 'relative'}}>
                <Text style={styles.tagText}>{item}</Text>
                <TouchableOpacity
                  style={styles.close}
                  onPress={() => removeTag(index)}>
                  <Ionicons
                    style={{color: Colors.white}}
                    name="close-circle"
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    marginTop: 10,
    borderRadius: 5,
    padding: 5,
  },
  title: {
    fontSize: 16,
    color: Colors.textColor,
  },
  contents: {
    textAlignVertical: 'bottom',
    textAlign: 'left',
    paddingVertical: 2,
    backgroundColor: Colors.white,
    flex: 1,
  },
  addBtnContainer: {
    alignItems: 'center',
  },
  addBtn: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    marginRight: 0,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  tagArray: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagLine: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomColor: Colors.gray1,
    borderBottomWidth: 1,
  },
  tagText: {
    color: Colors.white,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 28,
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default TagEditItem;
