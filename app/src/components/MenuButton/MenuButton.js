// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import Menu, { MenuTrigger, MenuOption, MenuOptions } from 'react-native-menu';

import type { NavigationProps } from '~/types/navigation';
import { logoutPlayer } from '~/redux/actions/player';
import styles from './MenuButton.styles';

type MenuButtonProps =
  & NavigationProps
  & {
  displayOptions: {
    [string]: {
      route: string,
      args?: {},
    },
  },
  canLogOut: boolean,
  logOut: Function,
};

const mapDispatchToProps = (dispatch: Function) => ({
  logOut: () => dispatch(logoutPlayer()),
});

const MenuButton = ({ navigation, displayOptions, canLogOut, logOut }: MenuButtonProps) => {
  const route = (o) => displayOptions[o].route;
  const args = (o) => displayOptions[o].args;

  const navigate = ({ route, args }) => {
    if (route === 'logout')
      return logOut();

    /* eslint-disable-next-line no-console */
    console.log('navigate', route, args);
    navigation.navigate(route, args);
  };

  const options = Object.keys(displayOptions).map(option => (
    <MenuOption key={`menu-option-${option}`} value={{ route: route(option), args: args(option) }}>
      <Text>{option}</Text>
    </MenuOption>
  ));

  const logoutOption = (
    <MenuOption key="menu-option-Logout" value={{ route: 'logout' }}>
      <Text>Log out</Text>
    </MenuOption>
  );

  return (
    <View>
      <Menu onSelect={navigate}>

        <MenuTrigger style={styles.trigger}>
          <Text style={styles.triggerText}>&#8942;</Text>
        </MenuTrigger>

        <MenuOptions>
          {options}
          {canLogOut && logoutOption}
        </MenuOptions>

      </Menu>
    </View>
  );
}

export default connect(null, mapDispatchToProps)(MenuButton);
