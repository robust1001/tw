import React from 'react';
import {Provider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import {MenuProvider} from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';

import AppNavigator from './navigation/AppNavigator';

import {store} from './store/store';

export default function App() {
  return (
    <Provider store={store}>
      <MenuProvider>
        <AppNavigator />
      </MenuProvider>
      <Toast />
      <FlashMessage position="bottom" />
    </Provider>
  );
}
