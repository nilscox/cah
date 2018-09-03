import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, Image } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import { fetchPlayer, updatePlayer, playerAvatarUri, playerChangeAvatar } from '../../services/player-service';
import Loading from '../../components/Loading';
import Form, { FormField } from '../../components/Form';
import Button, { ButtonsGroup } from '../../components/Button';
import screen from '../screen.styles';


const styles = StyleSheet.create({
  avatar: {
    width: 160,
    height: 160,
    borderWidth: 1,
    borderColor: '#CCC',
    alignSelf: 'center',
    resizeMode: 'contain',
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
    avatar: null,
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
    let { extra, avatar } = this.state;

    if (extra.length === 0)
      extra = null;

    const { res, json } = await updatePlayer(player.nick, { extra, avatar });

    if (res.status === 200)
      this.props.history.go(-2);
    else
      this.props.onError('updatePlayer', json);
  }

  render() {
    const { player } = this.props.location.state;
    const { avatar: newAvatar } = this.state;
    const avatarSource = newAvatar
      ? { uri: newAvatar.uri }
      : playerAvatarUri(player);

    return (
      <View style={[screen.view, screen.viewPadding, styles.view]}>

        <Text style={screen.title}>{ player.nick }</Text>

        <TouchableOpacity onPress={() => this.displayAvatarImagePicker()}>
          <Image style={styles.avatar} source={avatarSource} />
        </TouchableOpacity>

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

  async displayAvatarImagePicker() {
    try {
      const image = await ImagePicker.openPicker({
        width: 200,
        height: 200,
        cropping: true,
      });

      this.setState({
        avatar: {
          uri: image.path,
          type: image.mime,
          name: 'avatar-' + this.props.player.nick,
        },
      });
    } catch (e) {
      this.props.onError('ImagePicker.openPicker', e);
    }
  }

}
