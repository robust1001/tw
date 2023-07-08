import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Colors from '../constants/Colors';

const PayItem = props => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        props.sel ? {borderColor: Colors.tomato} : {borderColor: Colors.white},
      ]}
      onPress={props.onPress}>
      <View style={{position: 'relative'}}>
        <View style={styles.cardFooter}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.title}>{props.title}</Text>
            <View style={{flexDirection: 'row', alignContent: 'flex-end'}}>
              <Text style={styles.duaration}>￥</Text>
              <Text style={styles.duaration1}>{props.money}</Text>
              <Text style={styles.duaration}>{props.dur}</Text>
            </View>
            <Text style={styles.comment}>{props.comment}</Text>
          </View>
        </View>
        {props.tuijian && (
          <Image style={styles.img} source={require('../assets/tuijian.png')} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 2,
    marginHorizontal: 2,
  },
  cardFooter: {
    height: 140,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    alignSelf: 'center',
    color: Colors.primary,
  },
  duaration: {
    fontSize: 16,
    alignSelf: 'flex-end',
    color: Colors.textColor,
    fontWeight: 'bold',
  },
  duaration1: {
    fontSize: 28,
    alignSelf: 'flex-end',
    color: Colors.tomato,
    fontWeight: 'bold',
  },
  comment: {
    fontSize: 12,
    alignSelf: 'center',
    color: Colors.textColor,
    marginTop: 20,
    textAlign: 'center',
  },
  img: {
    width: 54,
    height: 18,
    borderRadius: 3,
    resizeMode: 'cover',
    justifyContent: 'center',
    position: 'absolute',
    top: -10,
    left: -4,
  },
});

export default PayItem;
