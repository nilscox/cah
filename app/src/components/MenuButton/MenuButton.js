// @flow

import * as React from 'react';
import { View, Text } from 'react-native';
import Menu, { MenuTrigger, MenuOption, MenuOptions } from 'react-native-menu';

import type { NavigationProps } from '~/types/navigation';
import styles from './MenuButton.styles';

type MenuButtonProps =
  & { displayOptions: { [string]: { route: string, args?: {} } } }
  & NavigationProps;

const MenuButton = ({ navigation, displayOptions }: MenuButtonProps) => {
  const route = (o) => displayOptions[o].route;
  const args = (o) => displayOptions[o].args;

  const navigate = ({ route, args }) => {
    /* eslint-disable-next-line no-console */
    console.log('navigate', route, args);
    navigation.navigate(route, args);
  };

  const options = Object.keys(displayOptions).map(option => (
    <MenuOption key={`menu-option-${option}`} value={{ route: route(option), args: args(option) }}>
      <Text>{option}</Text>
    </MenuOption>
  ));

  return (
    <View>
      <Menu onSelect={navigate}>

        <MenuTrigger style={styles.trigger}>
          <Text style={styles.triggerText}>&#8942;</Text>
        </MenuTrigger>

        <MenuOptions>
          {options}
        </MenuOptions>

      </Menu>
    </View>
  );
}

export default MenuButton;
