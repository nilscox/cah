import * as React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

import Button from '../../components/Button';

const INPUT_BORDER_COLOR = '#444484';
const INPUT_BORDER_WIDTH = 1;

const styles = StyleSheet.create({
  inputNick: {
    fontSize: 26,
    borderColor: INPUT_BORDER_COLOR,
    borderBottomWidth: INPUT_BORDER_WIDTH,
    marginHorizontal: 30,
    paddingVertical: 5,
  },
  buttonLogin: {
    marginHorizontal: 30,
    marginVertical: 30,
  },
});

class LoginForm extends React.Component {
  state = {
    nick: '',
    buttonDisabled: true,
  };

  onNickChange = (nick) => {
    this.setState({
      nick,
      buttonDisabled: nick.length <= 3,
    });
  };

  render() {
    const { style, onLogin } = this.props;
    const { nick, buttonDisabled } = this.state;

    return (
      <View style={style}>

        <TextInput
          style={styles.inputNick}
          underlineColorAndroid="transparent"
          onChangeText={this.onNickChange}
          value={this.state.text}
          placeholder="Your nick"
        />

        <Button
          style={styles.buttonLogin}
          disabled={buttonDisabled}
          text="Log in"
          onPress={() => {}}
        />

      </View>
    );
  }
}

export default LoginForm;
