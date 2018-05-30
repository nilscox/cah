// @flow

import * as React from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { connect } from 'react-redux';

import type { NavigationProps } from '~/types/navigation';
import type { Player } from '~/redux/state/player';
import { loginPlayer } from '~/redux/actions';

type StatePropsType = {
  player: ?Player,
};

type DispatchPropsType = {
  logIn: string => any,
};

type AuthPropsType =
  & StatePropsType
  & NavigationProps
  & DispatchPropsType;

type AuthStateType = {
  nick: string,
};

const mapStateToProps = ({ player }) => ({
  player: player,
});

const mapDispatchToProps: Function => DispatchPropsType = dispatch => ({
  logIn: nick => dispatch(loginPlayer(nick)),
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
  logInButton: {
    marginTop: 20,
  },
});

class AuthScreen extends React.Component<AuthPropsType, AuthStateType> {
  state = {
    nick: '',
  };

  componentDidMount() {
    this.redirectIfLoggedIn();
  }

  componentDidUpdate() {
    this.redirectIfLoggedIn();
  }

  redirectIfLoggedIn() {
    const { navigation, player } = this.props;

    if (player)
      navigation.navigate('Lobby');
  }

  handleLogIn = () => {
    const { logIn } = this.props;
    const { nick } = this.state;

    logIn(nick.trim());
  };

  render() {
    const { nick } = this.state;

    return (
      <View style={styles.page}>

        <View style={styles.title}>
          <Text style={styles.titleText}>CAH</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            placeholder="Your nick..."
            value={nick}
            onChangeText={(text) => this.setState({ nick: text })}
          />
          <View style={styles.logInButton}>
            <Button title="Log in" onPress={this.handleLogIn} />
          </View>
        </View>

      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
