import { Component } from 'react';

export default class Card extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { hidden, card, offset } = this.props;

		return (
			<div
				style={{
					position: 'absolute',
					left: `${offset * 35}px`,
					background: hidden ? 'rgba(0, 0, 0, 0.9)' : `url(${card})`,
					backgroundSize: 'contain',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					borderRadius: '5px',
					width: '125px',
					height: '100%',
					margin: '0 auto',
				}}
			/>
		);
	}
}
