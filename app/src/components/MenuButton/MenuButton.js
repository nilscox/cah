import * as React from 'react';
import { View, Text } from 'react-native';
import Menu, { MenuTrigger, MenuOption, MenuOptions } from 'react-native-menu';

import styles from './MenuButton.styles';

const MenuButton = ({ navigation, displayOptions }) => {
  const route = (o) => displayOptions[o].route;
  const args = (o) => displayOptions[o].args;

  const options = Object.keys(displayOptions).map(option => (
    <MenuOption key={`menu-option-${option}`} value={{ route: route(option), args: args(option) }}>
      <Text>{option}</Text>
    </MenuOption>
  ));

  return (
    <View>
      <Menu onSelect={({ route, args }) => navigation.navigate(route, args)}>

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
