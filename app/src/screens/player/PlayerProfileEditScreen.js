import * as React from 'react';
import { StyleSheet, View, Text, TextInput, Image } from 'react-native';

import { fetchPlayer, updatePlayer, playerAvatarUri } from '../../services/player-service';
import Loading from '../../components/Loading';
import Form, { FormField } from '../../components/Form';
import Button, { ButtonsGroup } from '../../components/Button';
import screen from '../screen.styles';


const styles = StyleSheet.create({
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: '#CCC',
    alignSelf: 'center',
  },
  extraInput: {
    backgroundColor: '#EEE',
    borderColor: '#CCC',
    borderWidth: 1,
    marginVertical: 15,
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
});

export default class PlayerProfileEditScreen extends React.Component {

  state = {
    extra: undefined,
  };

  static getDerivedStateFromProps = (props, state) => {
    if (state.extra !== undefined)
      return null;

    return {
      extra: props.location.state.player.extra || '',
    };
  };

  async onSave() {
    const { player } = this.props.location.state;
    let { extra } = this.state;

    if (extra.length === 0)
      extra = null;

    const { res, json } = await updatePlayer(player.nick, { extra });

    if (res.status === 200)
      this.props.history.go(-2);
    else
      console.log(json);
  }

  render() {
    const { player } = this.props.location.state;

    return (
      <View style={[screen.view, screen.viewPadding, styles.view]}>

        <Text style={screen.title}>{ player.nick }</Text>

        <Image style={styles.avatar} source={playerAvatarUri(player)} />

        <Form>
          <FormField label="Online">
            <Text>{ player.connected ? 'yes' : 'no' }</Text>
          </FormField>

          <FormField label="In-game">
            <Text>{ player.gameId ? 'yes' : 'no' }</Text>
          </FormField>
        </Form>

        <TextInput
          style={styles.extraInput}
          value={this.state.extra}
          placeholder="Say something about you..."
          multiline
          numberOfLines={4}
          onChangeText={text => this.setState({ extra: text })}
        />

        <ButtonsGroup>
          <Button
            title="cancel"
            onPress={() => this.props.history.goBack()}
          />
          <Button
            primary
            title="save"
            onPress={() => this.onSave()}
          />
        </ButtonsGroup>

      </View>
    );
  }

}
