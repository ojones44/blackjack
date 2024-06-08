// components
import Hand from './components/Hand';
import Message from './components/Message';
import { VALUES } from './utils/values';

import { Component, Fragment } from 'react';

export default class App extends Component {
	constructor(props) {
		super(props);

		this.players = { DEALER: 'dealer', PLAYER: 'player', CPU: 'computer' };
		this.maxScore = 0;
		this.winner = null;

		this.state = {
			deck: null,
			[this.players.PLAYER]: [],
			[this.players.DEALER]: [],
			[this.players.CPU]: [],
			turn: this.players.CPU,
			isLoading: true,
			fetchError: null,
		};

		this.getScore = (hand) => {
			return hand.reduce((a, c) => {
				const value = VALUES[c.value] || +c.value;
				return (a += value);
			}, 0);
		};

		this.setTurn = (player) => {
			const nextPlayer = {
				computer: 'player',
				player: 'dealer',
				dealer: null,
			};
			this.setState((prevState) => ({
				...prevState,
				turn: nextPlayer[player],
			}));
		};

		this.drawCards = async (amount, deckId, player = null) => {
			const res = await fetch(
				`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=${amount}`
			);
			const cardArr = await res.json();

			if (player) {
				this.setState((prevState) => ({
					...prevState,
					[player]: [...prevState[player], ...cardArr.cards],
				}));
				return;
			}

			return cardArr.cards;
		};
	}

	async componentDidMount() {
		try {
			const res = await fetch(
				'https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
			);
			const deck = await res.json();
			const cards = await this.drawCards(6, deck.deck_id);
			this.setState((prevState) => {
				return {
					...prevState,
					deck: deck,
					dealer: [cards[0], cards[1]],
					player: [cards[2], cards[3]],
					computer: [cards[4], cards[5]],
				};
			});
		} catch (error) {
			console.log(error);
			this.setState((prevState) => ({
				...prevState,
				fetchError: error.message,
			}));
		} finally {
			this.setState((prevState) => ({ ...prevState, isLoading: false }));
		}
	}

	render() {
		if (this.state.isLoading) {
			return (
				<div className='loading'>
					<h1>Loading...</h1>
				</div>
			);
		}

		if (!this.state.turn) {
			Object.values(this.players).forEach((name) => {
				const hand = this.state[name];
				const score = this.getScore(hand);
				if (score > this.maxScore && score <= 21) {
					this.maxScore = score;
					this.winner = name;
				}
			});

			return (
				<div className='game-over'>
					<h1>GAME OVER</h1>
					{this.winner ? (
						<>
							<h4>WINNER IS {this.winner.toUpperCase()}</h4>
							<h4>SCORE: {this.maxScore}</h4>
						</>
					) : (
						<h4>EVERYONE BUST!</h4>
					)}
				</div>
			);
		}

		return (
			<Fragment>
				<header>
					<Message message='Blackjack' css='title accent-font' />
					<p>It is {this.state.turn}&apos;s go</p>
				</header>
				<section>
					{Object.values(this.players).map((player) => {
						return (
							<Hand
								key={player}
								turn={this.state.turn}
								player={player}
								hand={this.state[player]}
								drawCard={async () =>
									this.drawCards(1, this.state.deck.deck_id, player)
								}
								setTurn={() => this.setTurn(player)}
							/>
						);
					})}
				</section>
			</Fragment>
		);
	}
}
