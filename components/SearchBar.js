import React, {useState} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';

const SearchBar = ({hanlder, borderColor, textColor}) => {
  const [searchText, setSearchText] = useState('');

  const handleSearchTextChange = async text => {
    setSearchText(text);
    hanlder(text);
  };

  return (
    <View style={[styles.searchContainer, {borderColor: borderColor}]}>
      <Ionicons name="search-outline" size={24} color={borderColor} />
      <TextInput
        value={searchText}
        onChangeText={handleSearchTextChange}
        style={[styles.inputContainer, {color: textColor}]}
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 1,
  },
  inputContainer: {
    flex: 1,
    padding: 2,
  },
});

export default SearchBar;
