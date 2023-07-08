import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';
import String from '../constants/String';
import SearchBar from './SearchBar';

const keys = [
  String.all,
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '#',
];

const SectionSelector = ({sectionHandler, searchHandler}) => {
  const [searchText, setSearchText] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState(String.all);

  const renderHeader = (section, _, isActive) => {
    return (
      <View style={styles.accordionHeader}>
        <Text style={{fontWeight: 'bold', color: '#fff'}}>{activeSection}</Text>
        <Ionicons
          name={isActive ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={'#fff'}
        />
      </View>
    );
  };

  const handleSectionSelect = async section => {
    setActiveSection(section);
    setSearchText('');
    setExpanded(false);
    sectionHandler(section);
  };

  const handleSearchTextChange = async text => {
    setSearchText(text);
    searchHandler(text);
  };

  const renderContent = (section, _, isActive) => {
    return (
      <View style={styles.accordionContent}>
        <View style={styles.keyContainer}>
          {keys.map((key, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSectionSelect(key)}>
              <Text style={{marginHorizontal: 5, color: Colors.white}}>
                {key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <SearchBar
          hanlder={handleSearchTextChange}
          borderColor={Colors.white}
          textColor={Colors.white}
        />
      </View>
    );
  };
  return (
    <View>
      <Collapse isExpanded={expanded} onToggle={() => setExpanded(!expanded)}>
        <CollapseHeader>{renderHeader()}</CollapseHeader>
        <CollapseBody>{renderContent()}</CollapseBody>
      </Collapse>
    </View>
  );
};

const styles = StyleSheet.create({
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  accordionContent: {
    paddingHorizontal: 10,
    paddingBottom: 5,
    backgroundColor: Colors.primary,
  },
  keyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default SectionSelector;
