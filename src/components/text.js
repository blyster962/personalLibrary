import React, {PropTypes} from 'react';
import TextField from 'material-ui/TextField';

export default React.createClass({
	displayName: 'Text',

	propTypes: {
	  name: PropTypes.string.isRequired,
	  placeholder: PropTypes.string,
	  label: PropTypes.string,
		disabled: PropTypes.bool
	},

	contextTypes: {
		update: PropTypes.func.isRequired,
		values: PropTypes.object.isRequired
	},

	updateValue(value) {
		this.context.update(this.props.name, value);
	},

	onChange(event) {
		this.updateValue(event.target.value);
	},

	render() {
	  return (
	  	<TextField name={this.props.name}
	  	  hintText={this.props.placeholder}
	  	  floatingLabelText={this.props.label}
				disabled={this.props.disabled}
				 />
	  );
	}
});
