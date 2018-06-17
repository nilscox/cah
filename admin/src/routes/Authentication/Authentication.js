import * as React from 'react';
import { connect } from 'react-redux';

import { signIn } from '../../redux/actions';

const mapDispatchToProps = (dispatch) => ({
  signIn: (password) => dispatch(signIn(password)),
});

class Authentication extends React.Component {
  state = {
    password: '',
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.signIn(this.state.password);
  };

  handleTextChanged = (e) => {
    this.setState({ password: e.target.value });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>

        <input
          value={this.state.password}
          type="password"
          placeholder="Password..."
          onChange={this.handleTextChanged}
        />

        <input type="submit" value="Sign in" />

      </form>
    );
  }
}

export default connect(null, mapDispatchToProps)(Authentication);
