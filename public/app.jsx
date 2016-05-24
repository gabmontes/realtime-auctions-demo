// React components

const AuctionedItem = function (props) {
	return {
		props,
		render () {
			const { item } = this.props;
			if (!item) {
				return (
					<div />
				);
			}
			return (
				<div className="auctionedItem">
					<img className="auctionedItemImage" src={item.imageSrc}></img>
					<div className="description">
						{item.description}
					</div>
				</div>
			);
		}
	}
}

const CurrencyText = function (props) {
	return {
		props,
		render () {
			const locale = navigator.language;
			const opts = {
				style:'currency',
				currency:'EUR'
			};
			const str = Number(this.props.value /100).toLocaleString(locale, opts);
			return (
				<span>{str}</span>
			);
		}
	}
}

const AuctionStatus = function (props) {
	return {
		props,
		render () {
			const { highest } = this.props;
			let Highest;
			if (highest && highest.price) {
				Highest = (<CurrencyText value={highest.price} />);
			} else {
				Highest = (<span>None</span>);
			}
			return (
				<div className="bidStatus">
					<div className="text">
						Highest bid: {Highest}
					</div>
				</div>
			);
		}
	}
}

const AuctionControls = function (props) {
	return {
		props,
		render () {
			const { next } = this.props;
			if (!next) {
				return (<div />);
			}
			return (
				<div className="bidControls enabled noSelect" onClick={this.props.onUserBid}>
					Commit to bid <CurrencyText value={next.price} />
				</div>
			);
		}
	}
}

const LiveAuction = function (props) {
	return {
		props,
		render () {
			return (
				<div>
					<h1>Realtime auction demo</h1>
					<AuctionedItem item={this.props.state.item} />
					<AuctionStatus highest={this.props.state.highest} />
					<AuctionControls next={this.props.state.next} onUserBid={this.props.actions.bid} />
				</div>
			);
		}
	}
}

// Data store

const socket = io();

let render;

let state = {};

const actions = {
	setData () {
		$.getJSON('/api/auctions/current', function (data) {
			state.id = data.id;
			state.item = data.item;
			render();
		});
	},
	setState (data) {
		state.highest = data.highest;
		state.next = data.next;
		render();
	},
	bid () {
		const bidData = {
			id: state.id,
			bidId: state.next.id
		};
		socket.emit('bid', bidData);
	}
};

socket.on('connect', actions.setData);

socket.on('update', actions.setState);

render = function () {
	ReactDOM.render(
		<LiveAuction state={state} actions={actions} />,
		document.getElementById('content')
	);
}

// Initialization

render();
