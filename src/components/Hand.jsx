import { Component } from 'react';
import Card from './Card';
import Status from './Status';
import Button from './Button';

// utils
import { VALUES } from '../utils/values';

export default class Hand extends Component {
	constructor(props) {
		super(props);

		this.getScore = (hand) => {
			return hand.reduce((a, c) => {
				const value = VALUES[c.value] || +c.value;
				return (a += value);
			}, 0);
		};

		this.sleep = async (ms) => {
			return new Promise((resolve) => setTimeout(resolve, ms));
		};

		this.state = {
			score: 0,
		};
	}

	render() {
		const { turn, player, hand, drawCard, setTurn } = this.props;
		const score = this.getScore(hand);
		const isYourTurn = turn === player;
		const isBust = score > 21;
		const isDealer = player.toLowerCase() === 'dealer';
		const notPlayer1 = player !== 'player';

		if (isYourTurn && notPlayer1) {
			if (isBust) {
				setTimeout(setTurn, 2000);
			} else if (notPlayer1 && !isBust && score > 17) {
				setTimeout(setTurn, 2000);
			} else if (notPlayer1 && score <= 17 && isYourTurn) {
				setTimeout(drawCard, 500);
			}
		} else if (isBust && isYourTurn) {
			setTimeout(setTurn, 2000);
		}

		return (
			<div className={`${isDealer ? 'dealer' : ''} hand`}>
				<p style={{ textTransform: 'capitalize' }}>{player} Hand</p>
				<div
					className={`${isBust || !isYourTurn ? 'disabled' : ''} cards`}
					style={{ width: `${(hand.length - 1) * 35 + 125}px` }}
				>
					{hand.map((card, i) => (
						<Card
							key={Math.random() * i}
							hidden={isDealer && i === 0}
							card={card.image}
							offset={i}
						/>
					))}
				</div>
				<Status
					isBust={isBust}
					cards={hand.length}
					score={isDealer ? '?' : score}
				/>
				{player.toLowerCase().includes('player') && (
					<div className='buttons'>
						<Button
							text='Stick'
							handleClick={setTurn}
							disabled={isBust || !isYourTurn}
						/>
						<Button
							text='Hit'
							handleClick={drawCard}
							disabled={isBust || !isYourTurn}
						/>
					</div>
				)}
			</div>
		);
	}
}
