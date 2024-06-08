import { Component } from 'react';

export default class Button extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { text, handleClick, disabled } = this.props;

		return (
			<button type='button' onClick={handleClick} disabled={disabled}>
				{text}
			</button>
		);
	}
}
