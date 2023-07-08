import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';

const ListItem = props => {
  const {item, expand} = props;

  return (
    <TouchableOpacity onPress={() => props.onPress()}>
      <View style={styles.container}>
        <Text style={styles.text}>{item.name}</Text>
        {item.detail && <Text style={styles.text2}>{item.detail}</Text>}
        {expand && (
          <Ionicons
            style={styles.btn}
            name="chevron-forward-outline"
            size={20}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    // width: '100%',
    borderBottomWidth: 1,
    borderColor: Colors.gray,
  },
  text: {
    flex: 1,
    marginLeft: 10,
    color: Colors.textColor,
  },
  text2: {
    flex: 2,
    color: Colors.textColor,
  },
});

export default ListItem;
