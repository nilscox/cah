// @flow

import * as React from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { connect } from 'react-redux';

import { loginPlayer } from './actions';

const mapDispatchToProps = dispatch => ({
  logIn: (nick) => dispatch(loginPlayer(nick)),
});

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  title: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 24,
    textAlign: 'center',
  },
  form: {
    flex: 2,
    marginHorizontal: 40,
  },
  nickInput: {
    borderColor: 'gray',
    borderBottomWidth: 1,
  },
  logInButton: {
    marginTop: 20,
  },
});

class AuthScreen extends React.Component {
  state = {
    nick: '',
  };

  onLogIn = () => {
    const { navigation, logIn } = this.props;
    const { nick } = this.state;

    logIn(nick.trim())
      .then(() => navigation.navigate('Lobby'));
  };

  render() {
    return (
      <View style={styles.page}>

        <View style={styles.title}>
          <Text style={styles.titleText}>CAH</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.nickInput}
            underlineColorAndroid="transparent"
            placeholder="Your nick..."
            value={this.state.nick}
            onChangeText={text => this.setState({ nick: text })}
          />
          <View style={styles.logInButton}>
            <Button title="Log in" onPress={this.onLogIn} />
          </View>
        </View>

      </View>
    );
  }
}

export default connect(null, mapDispatchToProps)(AuthScreen);
