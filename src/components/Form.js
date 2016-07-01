import React, {PropTypes} from 'react';

export default React.createClass({
  displayName: 'Form',

  propTypes: {
    children: PropTypes.node,
    values: PropTypes.object,
    update: PropTypes.func,
    reset: PropTypes.func,
    onSubmit: PropTypes.func
  },

  childContextTypes: {
    values: PropTypes.object,
    update: PropTypes.func,
    reset: PropTypes.func,
    submit: PropTypes.func
  },

  getChildContext() {
    return {
      values: this.props.values,
      update: this.props.update,
      reset: this.props.reset,
      submit: this.props.onSubmit
    }
  },

  render() {
    return (
      <form>
        {this.props.children}
      </form>
    );
  }
});
