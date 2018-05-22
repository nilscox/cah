// @flow

import * as React from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { connect } from 'react-redux';

import type { NavigationPropsType } from '~/types/navigation';
import type { Dispatch } from '~/types/actions';
import type { Player } from '~/types/player';
import { fetchPlayer, loginPlayer, wsOpen, wsMessage, wsError, wsClose } from '~/actions';
import type { State } from './reducer';

type StatePropsType = {
  player: ?Player,
};

type DispatchPropsType = {
  fetchPlayer: () => any,
  logIn: string => any,
  wsOpen: () => any,
  wsMessage: (any) => any,
  wsError: (any) => any,
  wsClose: (any) => any,
};

type AuthPropsType =
  & StatePropsType
  & NavigationPropsType
  & DispatchPropsType;

type AuthStateType = {
  nick: string,
};

const mapStateToProps: ({ auth: State }) => StatePropsType = ({ auth }) => ({
  player: auth.player,
});

const mapDispatchToProps: Dispatch => DispatchPropsType = dispatch => ({
  fetchPlayer: () => dispatch(fetchPlayer()),
  logIn: nick => dispatch(loginPlayer(nick)),
  wsOpen: () => dispatch(wsOpen()),
  wsMessage: (e) => dispatch(wsMessage(e)),
  wsError: (e) => dispatch(wsError(e)),
  wsClose: (e) => dispatch(wsClose(e)),
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

class AuthScreen extends React.Component<AuthPropsType, AuthStateType> {
  socket: any;

  state = {
    nick: '',
  };

  onLogIn = () => {
    const { logIn } = this.props;
    const { nick } = this.state;

    logIn(nick.trim());
  };

  constructor(props) {
    super(props);

    this.socket = null;
  }

  componentDidMount() {
    this.props.fetchPlayer();
  }

  componentDidUpdate() {
    const { player } = this.props;

    if (player)
      this.connectWS();
  }

  connectWS() {
    const { wsOpen, wsMessage, wsError, wsClose, navigation } = this.props;

    this.socket = new WebSocket('ws://192.168.0.18:8000');

    this.socket.onopen = () => {
      wsOpen();
      this.socket.send('{"action":"connected","nick":"Nils"}');

      setTimeout(() => {
        navigation.navigate('Lobby');
      }, 200);
    };

    this.socket.onmessage = (e: any) => {
      console.log('ws message', e);
      wsMessage(e);
    };

    this.socket.onerror = (e: any) => {
      console.log('ws error', e);
      wsError(e);
    };

    this.socket.onclose = (e: any) => {
      console.log('ws close', e);
      wsClose(e);
    };
  }

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

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
