import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { setInput } from "../actions/index";
import { PING_SERVER } from "../actions/sagas/types";
import styles from "../styles/base.scss";

class Home extends React.Component {
  static propTypes = {
    input: PropTypes.string.isRequired,
    setInput: PropTypes.func.isRequired,
    pingServer: PropTypes.func.isRequired,
    ping: PropTypes.string.isRequired
  }
  render() {
    return (
      <div className={styles.body}>
        {this.props.input}<br/>
        <input id="input"
          value={this.props.input}
          onChange={e => this.props.setInput(e.target.value)}
        /><br/>

        <p id="ping">
          {this.props.ping}
        </p><br/>
        <button id="ping-server" onClick={this.props.pingServer}>PING SERVER</button>
        <br/>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    input: state.input,
    ping: state.ping
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setInput: input => dispatch(setInput(input)),
    pingServer: () => dispatch({ type: PING_SERVER })
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
