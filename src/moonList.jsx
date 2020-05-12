import React, {Component} from 'react';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MoonLogic from "./moonLogic";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import produce from "immer";
import {v4 as uuidv4} from 'uuid';
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Remove from "@material-ui/icons/Remove";

class MoonList extends Component {
	constructor(props) {
		super(props);
		this.open = false;
		this.state = {
			moonList: []
		};
		
		// localStorage.setItem("moonList", JSON.stringify([
		// 	{
		// 		id: 1,
		// 		name: "moon1",
		// 		chunkToPopDistance: 0,
		// 		chunkSpeed: 0,
		// 		timeToPop: 0,
		// 		popsAt: new Date(),
		// 		popDistance: 200,
		// 		timestamps: [
		// 			{
		// 				id: 0,
		// 				time: new Date(),
		// 				distanceToPop: 200
		// 			}
		// 		],
		// 	}
		// ]))
		
		// localStorage.setItem("1", JSON.stringify({
		// 	chunkToPopDistance: 0,
		// 	chunkSpeed: 0,
		// 	timeToPop: 0,
		// 	popsAt: new Date(),
		// 	popDistance: 200,
		// 	timestamps: [
		// 		{
		// 			id: 0,
		// 			time: new Date(),
		// 			distanceToPop: 200
		// 		}
		// 	]
		// }))
	}
	
	componentDidMount() {
		// read cookie data
		const moons = JSON.parse(localStorage.getItem("moonList"));
		if (moons !== null) {
			this.setState(produce(draft => {
				draft.moonList = moons
			}))
		}
	}
	
	// componentWillUnmount() {
	// 	localStorage.setItem("moonList", JSON.stringify(this.state.moonList))
	// }
	
	openMoon = (id) => {
		this.setState(produce(draft => {
			draft.moonList.find(moon => moon.id === id).open = !this.state.moonList.find(moon2 => moon2.id === id).open;
		}), () => this._persist("moonList", this.state.moonList))
	};
	
	addMoon = () => {
		this.setState(produce(draft => {
			draft.moonList.push({
				id: uuidv4(),
				name: "New moon"
			})
		}), () => this._persist("moonList", this.state.moonList))
	};
	
	updateMoon = (id, ev) => {
		ev.persist();
		this.setState(produce(draft => {
			draft.moonList.find(moon => moon.id === id)[ev.target.name] = ev.target.value
		}), () => this._persist("moonList", this.state.moonList))
	};
	
	removeMoon = (id) => {
		this.setState(produce(draft => {
			draft.moonList = this.state.moonList.filter(moon => moon.id !== id)
		}), () => this._persist("moonList", this.state.moonList))
	};
	
	_persist = (key, value) => {
		localStorage.setItem(key, JSON.stringify(value))
	};
	
	minimizeAll = () => {
		console.log("setting")
		this.setState(produce(draft => {
			draft.moonList = this.state.moonList.map(moon => {
				return {...moon, open: false}
			})
		}, () => this._persist("moonList", this.state.moonList)))
	};
	
	render() {
		return <div>
			<Typography variant="h6">
				Moons
			</Typography>
			{/*<Button onClick={() => this.minimizeAll()}>Minimize all</Button>*/}
			
			{/*<IconButton edge="end"*/}
			{/*            aria-label="delete"*/}
			{/*            onClick={() => this.minimizeAll()}>*/}
			{/*	<Remove/>*/}
			{/*</IconButton>*/}
			<List>
				{this.state.moonList.map(moon => {
					return <React.Fragment key={moon.id}>
						<ListItem style={{display: "block", margin: "8px 0 0 0"}}>
							
							<TextField
								value={moon.name}
								name={"name"}
								onChange={(ev) => this.updateMoon(moon.id, ev)}
							/>
							<Button onClick={(ev) => this.removeMoon(moon.id)}>DELETE</Button>
							{/*<ListItemText*/}
							{/*	primary={moon.name}*/}
							{/*	secondary={'Pops in: // TODO'}*/}
							{/*/>*/}
							
							<ListItemSecondaryAction>
								{/* eslint-disable-next-line react/jsx-no-undef */}
								<IconButton edge="end"
								            style={{backgroundColor: "#c2c2c2"}}
								            onClick={() => this.openMoon(moon.id)}>
									{moon.open ? <ExpandLess/> : <ExpandMore/>}
								</IconButton>
							</ListItemSecondaryAction>
						
						
						</ListItem>
						<Collapse in={moon.open} timeout="auto" unmountOnExit>
							<List component="div">
								<ListItem>
									<MoonLogic moonName={moon.name} moonId={moon.id} moonData={moon.data}/>
								</ListItem>
							</List>
						</Collapse>
						<Divider/>
						
					</React.Fragment>
				})}
			</List>
			<Divider/>
			<Button onClick={this.addMoon} fullWidth color="primary"> Add
				moon </Button>
		</div>
	}
}

export default (MoonList)
