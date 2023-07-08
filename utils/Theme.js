import {StyleSheet} from 'react-native';
import Colors from '../constants/Colors';

export const Themes = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  primaryColor: {
    // color: '#fff',
  },
  text: {
    color: Colors.textColor,
    fontSize: 14,
  },
  title: {
    color: Colors.black,
    fontSize: 28,
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    backgroundColor: Colors.primary,
    marginVertical: 8,
    paddingVertical: 10,
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
  },
  secondaryButton: {
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  inputContainer: {
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: {
    paddingHorizontal: 5,
    flex: 1,
    paddingVertical: 8,
  },
  thumb: {
    marginTop: 10,
    marginRight: 10,
    width: 50,
    height: 50,
    borderRadius: 3,
    backgroundColor: Colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb_img: {
    width: 50,
    height: 50,
    borderRadius: 3,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  thumb_close: {
    position: 'absolute',
    top: -3,
    right: -3,
  },
  fullimg: {
    width: '100%',
    height: '100%',
  },
  avatar_big: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: Colors.white,
  },
  avatar_small: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: Colors.white,
  },
  tagText: {
    color: Colors.white,
    justifyContent: 'center',
  },
  tagRect: {
    borderRadius: 5,
    margin: 2,
    padding: 3,
  },
});
