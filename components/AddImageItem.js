import React, {useRef, useEffect} from 'react';
import {View, Image, TouchableOpacity, Modal} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';
import String from '../constants/String';
import Util from '../utils/Util';
import ENV from '../env';
import {Themes} from '../utils/Theme';
import TakePic from './TakePic';

const AddImageItem = props => {
  const refRBSheetImage = useRef();
  const [srvImageList, setSrvImageList] = React.useState([]);
  const [selImageIndex, setSelImageIndex] = React.useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);

  useEffect(() => {
    if (props.clearImgs) clearImages();
  }, [props.clearImgs]);

  const addImage = imagePath => {
    Util.uploadImage(imagePath)
      .then(res => {
        const resData = res.json();
        const newList = [...srvImageList, resData.url];
        setSrvImageList(newList);
        props.onImageTaken(newList);
      })
      .catch(error => {
        console.log('image upload error: ', error);
      });
  };

  const clearImages = () => {
    setSrvImageList([]);
  };

  const showImage = index => {
    setSelImageIndex(index);
    setModalVisible(true);
  };

  const removeImage = index => {
    let tempImageList1 = [...srvImageList];
    tempImageList1.splice(index, 1);
    setSrvImageList(tempImageList1);
  };

  const showPic = () => {
    if (srvImageList.length >= props.maxCount) {
      const s = Util.strFormat(String.notifyMaxPicCount, props.maxCount);
      Util.showMessage(s);
    } else {
      refRBSheetImage.current.open();
    }
  };

  const takePicture = async mode => {
    refRBSheetImage.current.close();
    setTimeout(() => {
      Util.takeImage(mode)
        .then(image => {
          addImage(image.path);
        })
        .catch(err => {
          console.log('no image', err);
        });
    }, 800);
  };

  return (
    <>
      <View flexDirection="row" alignItems="center">
        {srvImageList.map((item, index) => (
          <View key={index}>
            <TouchableOpacity
              style={[Themes.thumb]}
              onPress={() => showImage(index)}>
              <View style={{position: 'relative'}}>
                <Image
                  style={[Themes.thumb_img]}
                  source={Util.getThumbImage(item, false)}
                />
                <TouchableOpacity
                  style={[Themes.thumb_close]}
                  onPress={() => removeImage(index)}>
                  <Ionicons
                    style={{color: 'white'}}
                    name="close-circle"
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={[Themes.thumb]} onPress={() => showPic()}>
          <Ionicons
            style={{color: Colors.button}}
            name="camera-outline"
            size={24}
          />
        </TouchableOpacity>
      </View>
      <RBSheet
        ref={refRBSheetImage}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          draggableIcon: {
            backgroundColor: Colors.black,
          },
        }}>
        <TakePic handler={mode => takePicture(mode)} />
      </RBSheet>
      <Modal visible={modalVisible}>
        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <Image
            style={[Themes.fullimg]}
            resizeMode={'contain'}
            source={{uri: ENV.urlBackend + `${srvImageList[selImageIndex]}`}}
          />
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default AddImageItem;
