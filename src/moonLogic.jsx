import React, {Component} from 'react';
import MoonPresent from "./moonPresent";
import produce from "immer";
import {differenceInHours, max, parseISO, isAfter, isBefore, isEqual, parse} from 'date-fns';
import {v4 as uuidv4} from 'uuid';
// import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-timezone';
import {maxTimestamp} from "./utils";

class MoonLogic extends Component {
	constructor(props) {
		super(props);
		this.state = {
			chunkToPopDistance: 0,
			chunkSpeed: 0,
			timeToPop: 0,
			popsAt: new Date(),
			popDistance: 200,
			fuckedUp: false,
			notes: '',
			timestamps: [
				{
					id: 0,
					time: new Date(),
					distanceToPop: 200
				}
			],
		}
	}
	
	componentDidMount() {
		const localStore = localStorage.getItem(this.props.moonId);
		if (localStore !== null) {
			const localStorageState = JSON.parse(localStore);
			this.setState(produce(draft => {
				return draft = localStorageState;
			}), () => {
			});
		}
	}
	
	recalculate = () => {
		// recalculate the whole thing
	};
	
	validateTimestamps = (timestamps) => {
		let fuckedUp = false;
		let sortedTimestamps = [];
		
		function compare(a, b) {
			if (a.distanceToPop < b.distanceToPop) {
				return -1;
			}
			if (a.distanceToPop > b.distanceToPop) {
				return 1;
			}
			return 0;
		}
		
		sortedTimestamps = [...timestamps.map(ts => {
			if (typeof ts.time == "string") {
				return {...ts, time: parseISO(ts.time), distanceToPop: parseInt(ts.distanceToPop, 10)}
			} else {
				return {...ts, distanceToPop: parseInt(ts.distanceToPop, 10)}
			}
		})].sort(compare);
		
		for (let i = 0; i < sortedTimestamps.length - 1; i++) {
			if (!isAfter(sortedTimestamps[i].time, sortedTimestamps[i + 1].time)) {
				fuckedUp = true;
			}
		}
		
		this.setState(draft => {
			draft.fuckedUp = fuckedUp;
		}, () => this._persist(this.props.moonId, this.state))
		
		console.log("sorted: ", sortedTimestamps);
	};
	
	addTimestamp = () => {
		const zonedDate = new Date();
		console.log("date1: ", zonedDate.toISOString());

		this.setState(produce(draft => {
				draft.timestamps.push({
					id: uuidv4(),
					time: zonedDate.toISOString(),
					distanceToPop: 0
				})
			}), () => {
				const timeToPop = this.calculateTimeToPop(this.state.timestamps);
				console.log("timeToPop", timeToPop);
				const length = this.state.timestamps.length;
				this.setState(produce(draft => {
					draft.timeToPop = timeToPop
					draft.popsAt = new Date();
					// draft.timestamps[length-1].time = parseISO(this.state.timestamps[length-1].time)
				}));
				this._persist(this.props.moonId, this.state);
				this.validateTimestamps(this.state.timestamps);
			}
		)
	};
	
	updateTimstampDate = (id, newDate) => {
		console.log("newDate: " , newDate)
		this.setState(produce(draft => {
				draft.timestamps.find(ts => ts.id === id).time = newDate.toISOString();
			}), () => {
				// console.log("updated: ", id, " time: ", this.state.timestamps.find(ts => ts.id === id).time)
				const timeToPop = this.calculateTimeToPop(this.state.timestamps);
				this.setState(produce(draft => {
					draft.timeToPop = timeToPop;
					draft.popsAt = new Date();
				}));
				this._persist(this.props.moonId, this.state);
				this.validateTimestamps(this.state.timestamps);
			}
		)
	};
	
	updateMoonData = (ev) => {
		ev.persist();
		console.log("tar: ", ev.target.name, "val", ev.target.value)
		this.setState(produce(draft => draft[ev.target.name] = ev.target.value
			, () => {
				this._persist(this.props.moonId, this.state);
			})
		)
	};
	
	updateTimestamp = (id, ev) => {
		ev.persist();
		this.setState(produce(draft => {
				draft.timestamps.find(ts => ts.id === id)[ev.target.name] = ev.target.value;
			}), () => {
				const timeToPop = this.calculateTimeToPop(this.state.timestamps);
				this.setState(produce(draft => {
					draft.timeToPop = timeToPop;
					draft.popsAt = new Date();
				}));
				this._persist(this.props.moonId, this.state)
				this.validateTimestamps(this.state.timestamps);
			}
		)
	};
	
	removeTimestamp = (id) => {
		this.setState(produce(draft => {
			draft.timestamps = draft.timestamps.filter(timestamp => timestamp.id !== id)
		}), () => {
			const timeToPop = this.calculateTimeToPop(this.state.timestamps);
			this.setState(produce(draft => {
				draft.timeToPop = timeToPop;
				draft.popsAt = new Date();
			}));
			this._persist(this.props.moonId, this.state)
			this.validateTimestamps(this.state.timestamps);
		})
	};
	
	calculateSpeed = (timestamp1, timestamp2) => {
		let formattedDate1 = timestamp1.time;
		let formattedDate2 = timestamp2.time;
		
		if (typeof formattedDate1 == "string") {
			formattedDate1 = parseISO(timestamp1.time)
		}
		
		if (typeof formattedDate2 == "string") {
			formattedDate2 = parseISO(timestamp2.time)
		}
		const hourDifference = differenceInHours(formattedDate1, formattedDate2);
		const distance = Math.abs(timestamp1.distanceToPop - timestamp2.distanceToPop);
		const speed = distance / Math.abs(hourDifference);
		console.log(formattedDate1, formattedDate2)
		
		return speed;
	};
	
	updateChunkSpeed = (newSpeed) => {
		this.setState(produce(draft => {
			draft.chunkSpeed = newSpeed
		}))
	};
	
	updatePopDistance = (popDistance) => {
		this.setState(produce(draft => {
			draft.popDistance = popDistance
		}))
	};
	
	// _maxTimestamp = (timestamps) => {
	// 	const times = timestamps.map(ts => parseISO(ts.time));
	// 	return max(times);
	// };
	
	calculateTimeToPop = (timestamps) => {
		console.log("timestamps: " , timestamps);
		const maxTstp = maxTimestamp(timestamps);
		const maxIndex = timestamps.findIndex(ts => {
			if (typeof ts.time == "string") {
				console.log("tstime: " , parseISO(ts.time), " max: " , maxTstp)
				return isEqual(parseISO(ts.time), maxTstp)
			}
			return isEqual(parseISO(ts.time), maxTstp)
		});
		
		console.log("maxIndex: " , maxIndex);
		const speeds = [];
		let timeToPop = 0;
		
		console.log("length:", timestamps.length)
		// console.log("lll: ", times);
		
		if (timestamps.length >= 2) {
			for (let i = 0; i < timestamps.length - 1; i++) {
				// console.log("speed1: ", timestamps[i], timestamps[i + 1])
				speeds.push(this.calculateSpeed(timestamps[i], timestamps[i + 1]))
			}
			
			console.log("speeds: ", speeds)
			const avgSpeed = speeds.reduce((curr, acc) => curr + acc) / (timestamps.length - 1);
			// console.log("avg speed: ", avgSpeed, "max timestmp: ", maxTstp.toString());
			
			// const biggestTimestamp = timestamps.find(ts => {
			// 	// console.log("ts time: ", ts.time, maxTstp.toString())
			// 	return parseISO(ts.time) == maxTstp.toString()
			// })
			
			// console.log("biggest: ", timestamps.find(ts=> ts.time === maxTstp))
			
			timeToPop = timestamps[maxIndex].distanceToPop / avgSpeed;
		}
		
		console.log("time to pop: ", timeToPop)
		if (isNaN(timeToPop)) {
			return 0
		} else {
			return timeToPop.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
		}
	};
	
	_persist = (key, value) => {
		localStorage.setItem(key, JSON.stringify(value))
	};
	
	render() {
		return <MoonPresent moonName={this.props.moonName}
		                    moonId={this.props.moonId}
		                    notes={this.state.notes}
		                    updateMoonData={this.updateMoonData}
		                    timestampsFuckedUp={this.state.fuckedUp}
		                    addTimestamp={this.addTimestamp}
		                    updateTimestamp={this.updateTimestamp}
		                    updateTimstampDate={this.updateTimstampDate}
		                    removeTimestamp={this.removeTimestamp}
		                    chunkSpeed={this.state.chunkSpeed}
		                    popsAt={this.state.popsAt}
		                    timeToPop={this.state.timeToPop}
		                    timestamps={this.state.timestamps}/>
	}
}

export default (MoonLogic)
