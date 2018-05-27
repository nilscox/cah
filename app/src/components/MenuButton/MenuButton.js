import * as React from 'react';
import { View, Text } from 'react-native';
import Menu, { MenuTrigger, MenuOption, MenuOptions } from 'react-native-menu';

import styles from './MenuButton.styles';

const MenuButton = ({ navigation, displayOptions }) => {
  const options = displayOptions.map(option => (
    <MenuOption key={`menu-option-${option}`} value={option}>
      <Text>{option}</Text>
    </MenuOption>
  ));

  return (
    <View>
      <Menu onSelect={(value) => navigation.navigate(value)}>

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
