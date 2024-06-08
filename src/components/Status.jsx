import { Component } from 'react';

export default class Status extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { isBust, cards, score } = this.props;

		return (
			<div className='status accent-font fs-600'>
				{isBust ? (
					<p>YOU ARE OUT</p>
				) : (
					<>
						<p>
							Cards: <span className='fc-gold'>{cards}</span>
						</p>
						<p>
							Score: <span className='fc-gold'>{score}</span>
						</p>
					</>
				)}
			</div>
		);
	}
}
