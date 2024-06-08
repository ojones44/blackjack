import { Component } from 'react';

export default class Message extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { message, css, style } = this.props;

		return (
			<p style={style} className={css}>
				{message}
			</p>
		);
	}
}
