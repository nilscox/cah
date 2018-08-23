import * as React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableOpacity,
  Picker,
  TextInput
} from 'react-native';


const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    marginVertical: 30,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: {
    width: 120,
  },
  fieldLabelText: {
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#CCC',
    borderBottomWidth: 1,
  },
  langPicker: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 50,
  },
  createBtnText: {
    fontWeight: 'bold',
  },
});

export default class CreateGameModale extends React.Component {

  state = {
    lang: 'fr',
    nbQuestions: 32,
    cardsPerPlayer: 11,
  };

  render() {
    const { visible, createGame, cancel } = this.props;

    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={visible}
        onRequestClose={() => {
          alert('Modal has been closed.');
        }}>
        <View style={styles.view}>

          <Text style={styles.title}>Create a game</Text>

          {this.renderLangPicker()}
          {this.renderNbQuestionsInput()}
          {this.renderCardsPerPlayerInput()}
          {this.renderActions()}

        </View>
      </Modal>
    );
  }

  renderField(label, value) {
    return (
      <View style={styles.field}>
        <View style={styles.fieldLabel}>
          <Text style={styles.fieldLabelText}>
            { label }
          </Text>
        </View>
        { value }
      </View>
    );
  }

  renderLangPicker() {
    const { lang } = this.state;
    const items = {
      fr: 'Français',
      en: 'English',
    };

    return this.renderField('Language', (
      <Picker
        style={styles.langPicker}
        selectedValue={lang}
        onValueChange={lang => this.setState({ lang })}
      >
        { Object.keys(items).map(lang => (
          <Picker.Item key={lang} label={items[lang]} value={lang} />
        )) }
      </Picker>
    ));
  }

  renderNbQuestionsInput() {
    return this.renderField('Questions', (
      <TextInput
        style={styles.input}
        value={'' + this.state.nbQuestions}
        placeholder="32"
        keyboardType="numeric"
        onChangeText={nbQuestions => this.setState({ nbQuestions })}
      />
    ));
  }

  renderCardsPerPlayerInput() {
    return this.renderField('Cards per player', (
      <TextInput
        style={styles.input}
        value={'' + this.state.cardsPerPlayer}
        placeholder="11"
        keyboardType="numeric"
        onChangeText={cardsPerPlayer => this.setState({ cardsPerPlayer })}
      />
    ));
  }

  renderActions() {
    const { lang, nbQuestions, cardsPerPlayer } = this.state;

    return (
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => this.props.cancel()}>
          <Text>CANCEL</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.createGame(lang, ~~nbQuestions, ~~cardsPerPlayer)}
        >
          <Text style={styles.createBtnText}>CREATE GAME</Text>
        </TouchableOpacity>
      </View>
    );
  }

}