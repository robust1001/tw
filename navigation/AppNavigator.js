import React from 'react';
import {useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {AuthNavigator} from './SocialAppNavigator';
import MainNavigator from './SocialAppNavigator';
import StartupScreen from '../screens/StartupScreen';

const AppNavigator = props => {
  const isAuth = useSelector(state => !!state.auth.token);
  const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin);
  // console.log('isAuth: ', isAuth);
  // console.log('didTryAutoLogin: ', didTryAutoLogin);
  const linking = {
    prefixes: ['tengwei://'],
    config: {
      initialRouteName: 'Main',
      screens: {
        Main: 'main',
        PostDetail: {
          path: 'postDetail/:postid',
        },
        NotFound: '*',
      },
    },
  };

  return (
    //刚开始不许显示出来StartupScreen
    //从StartupScreen回来的时候，didTryAutoLogin=true是用以前存的用户信息来自动登录过意思，如果成功了isAuth=true，所以转到基本页面，不成功了没有以前成功登陆过，所以要转到登陆页面
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        {!isAuth && !didTryAutoLogin && <StartupScreen />}
        {!isAuth && didTryAutoLogin && <AuthNavigator />}
        {isAuth && <MainNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
