import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import {setInput} from "../actions/index";
import {PING_SERVER} from "../actions/sagas/types";
import styles from "../styles/base.scss";

const Home = props => {
  return (
    <div className={styles.body}>
      {props.input}<br/>
      <input id="input"
        value={props.input}
        onChange={e => props.setInput(e.target.value)}
      /><br/>

      {props.ping}<br/>
      <button onClick={props.pingServer}>PING SERVER</button>
      <br/>
    </div>
  );
};

Home.propTypes = {
  input: PropTypes.string.isRequired,
  setInput: PropTypes.func.isRequired,
  pingServer: PropTypes.func.isRequired,
  ping: PropTypes.string.isRequired
};
const mapStateToProps = state => {
  return {
    input: state.input,
    ping: state.ping
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setInput: input => dispatch(setInput(input)),
    pingServer: () => dispatch({type: PING_SERVER})
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
