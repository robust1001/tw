import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import AddImageItem from '../../components/AddImageItem';
import Colors from '../../constants/Colors';
import ENV from '../../env';
import Util from '../../utils/Util';
import String from '../../constants/String';
import {Themes} from '../../utils/Theme';
import Header from '../../components/Header';

const FeedBackScreen = props => {
  const {route} = props;
  const type = route.params.type;
  const otherId = route.params.otherId;
  const taskId = route.params.taskId;
  const [content, onChangeText] = useState('');
  const [kindList, setKindList] = useState([]);
  const [selKindIndex, setSelKindIndex] = useState(-1);
  const [imageList, setImageList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clearImgs, setClearImgs] = useState(false);

  console.log('type:', type);

  useEffect(() => {
    const kind =
      type == 'app_report'
        ? [
            String.app_report_kind1,
            String.app_report_kind2,
            String.app_report_kind3,
          ]
        : [
            String.post_report_kind1,
            String.post_report_kind2,
            String.post_report_kind3,
          ];
    setKindList(kind);
  }, []);

  const validateAuthForm = () => {
    if (selKindIndex == -1) {
      Util.showMessage(String.pleaseSelectReportKind);
      return false;
    }
    if (content == '') {
      Util.showMessage(String.pleaseInputReportContent);
      return false;
    }
    if (content.length < 15) {
      Util.showMessage(String.reportContentLenth);
      return false;
    }
    return true;
  };

  const clearForm = async () => {
    setSelKindIndex(-1);
    onChangeText('');
    setIsLoading(false);
  };

  const SaveHandler = async () => {
    if (validateAuthForm()) {
      setIsLoading(true);
      const response = await fetch(`${ENV.urlAPI}/user/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          userid: ENV.userid,
          token: ENV.token,
          type: type == 'app_report' ? 0 : 1,
          taskId: taskId,
          otherId: otherId,
          kind: selKindIndex,
          content: content,
          devInfo: ENV.DEV_INFO,
          images: imageList,
        }),
      });
      const resData = await response.json();
      let msg;
      if (resData.result) {
        msg = String.sendReportSuccess;
        clearForm();
        setClearImgs(true);
      } else {
        setIsLoading(false);
        msg = String.sendReportFailed;
      }
      Util.showMessage(msg);
    }
  };

  const imagePickedHandler = list1 => {
    setImageList(list1);
    setClearImgs(false);
  };

  return (
    <View>
      <Header back />
      <ScrollView>
        <View style={styles.container}>
          <View flexDirection="row">
            <Text style={styles.lblTitle}>{String.reportKind}</Text>
            <Text style={styles.lblStar}>*</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            {kindList.map((item, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={[
                    Themes.secondaryButton,
                    {
                      backgroundColor:
                        index == selKindIndex ? Colors.primary : Colors.gray1,
                    },
                  ]}
                  onPress={() => setSelKindIndex(index)}>
                  <Text style={styles.text}>{item}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View flexDirection="row">
            <Text style={styles.lblTitle}>{String.content1}</Text>
            <Text style={styles.lblStar}>*</Text>
          </View>
          <TextInput
            style={styles.inputField}
            multiline
            onChangeText={text => onChangeText(text)}
            placeholder={String.pleaseInputReportTask}
            autoCapitalize="none"
            editable
            value={content}
            numberOfLines={8}
            maxLength={200}
          />
          <Text style={styles.lblTitle}>{String.sendAttachment}</Text>
          <Text style={Themes.text}>
            {String.attachmentFormat}:PNG,JPG,JPEG,BMP
          </Text>
          <AddImageItem
            onImageTaken={imagePickedHandler}
            clearImgs={clearImgs}
            maxCount={3}
          />
          <TouchableOpacity style={Themes.button} onPress={SaveHandler}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.text}>{String.sendReport}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  inputField: {
    textAlignVertical: 'top',
    textAlign: 'left',
    backgroundColor: Colors.white,
    borderRadius: 5,
    minHeight: 150,
  },
  text: {
    color: Colors.white,
  },
  lblTitle: {
    color: Colors.textColor,
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  lblStar: {
    color: 'orangered',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 4,
  },
});

export default FeedBackScreen;
