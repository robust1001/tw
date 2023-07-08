import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';
import {Themes} from '../utils/Theme';
import {Badge} from 'react-native-elements';

const Children = props => (
  <View style={styles.container}>
    <Text style={[styles.text, props.textCenter ? styles.textCenter : null]}>
      {props.text}
    </Text>
    <View style={styles.subContainer}>
      {props.text2 !== '' && <Text style={Themes.text}>{props.text2}</Text>}
      {props.source && (
        <View>
          <Image style={Themes.avatar_small} source={props.source} />
        </View>
      )}
      {props.noExpand ? (
        <View style={{width: 20, height: 20}} />
      ) : (
        <>
          <Ionicons
            style={styles.btn}
            name="chevron-forward-outline"
            size={20}
          />
          {props.badge > 0 && (
            <Badge
              status="error"
              value={props.badge}
              containerStyle={{
                position: 'absolute',
                top: 2,
                left: -16,
              }}
            />
          )}
        </>
      )}
    </View>
  </View>
);

const SettingItem = props => {
  return (
    <>
      {props.onPress ? (
        <TouchableOpacity onPress={() => props.onPress()}>
          <Children {...props} />
        </TouchableOpacity>
      ) : (
        <Children {...props} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: Colors.gray,
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    marginLeft: 10,
    color: Colors.textColor,
  },
  textCenter: {
    textAlign: 'center',
  },
});

export default SettingItem;
