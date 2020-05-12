import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import {DatePicker, DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {addHours, parseISO, subHours} from 'date-fns';
import {maxTimestamp} from "./utils";

class MoonPresent extends Component {
	constructor(props) {
		super(props);
		this.date = new Date();
		this.maxTstp = maxTimestamp(this.props.timestamps);
	}
	
	componentDidUpdate(prevProps, prevState, snapshot) {
		// console.log("curr props: ", this.props)
		this.maxTstp = maxTimestamp(this.props.timestamps);
	}
	
	render() {
		
		// console.log("Fucked up: " , this.props.timestampsFuckedUp);
		// console.log("popsat: ", this.props);
		let popsAt = this.props.popsAt;
		if (typeof this.props.popsAt == "string") {
			popsAt = parseISO(popsAt)
		}
		console.log("timestamps: " , this.props.timestamps);
		console.log("parse: " , this.props.timestamps[0].time, " parsed: " , parseISO((new Date()).toISOString()))
		console.log("max tmstp: " , this.maxTstp)
		const validEstimation = `${addHours(this.maxTstp, this.props.timeToPop).toString()} (± ${this.props.timeToPop} hrs)`;
		
		// console.log("Before hours: " , popsAt, " after adding: " , addHours(popsAt, this.props.timeToPop).toString(), " added : ", this.props.timeToPop, " props.popsAt: " , this.props.popsAt)
		
		// console.log("AAAA>>>>", addHours(new Date(), 180));
		return <div style={{display: "block", padding: "24px", width: "100%"}}>
			<Typography variant="h6">
				Moon pops: {this.props.timestampsFuckedUp ? "Fucked up timestamps" : validEstimation}
			</Typography>
			<TextField value={this.props.notes}
			           fullWidth={true}
			           style={{marginTop: '16px', marginBottom: '16px'}}
			           name="notes"
			           onChange={this.props.updateMoonData}
			           label="Notes"
			           rows={4}
			           variant="outlined"
			           multiline/>
			
			<Typography>
				Bookmarks
			</Typography>
			<Typography style={{marginTop: '8px', marginBottom: '8px'}}>{this.props.timestampsFuckedUp ? "Bro timestamps are fucked" : null}</Typography>
			<List dense={true}>
				{this.props.timestamps.map(timestamp => {
					// console.log("timestamp: >>>>>>>>>", timestamp, "sub hrs: ", subHours(parseISO(timestamp.time), 3))
					return <ListItem key={timestamp.id} style={{marginTop: "8px"}}>
						{/*<ListItemAvatar>*/}
						{/*</ListItemAvatar>*/}
						<div style={{minWidth: "250px"}}>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<DateTimePicker
									emptyLabel={""}
									label="Date (use evetime dipshit)"
									value={timestamp.time}
									ampm={false}
									fullWidth={true}
									disableFuture={true}
									onChange={(ev) => this.props.updateTimstampDate(timestamp.id, ev)}
									// format="yyyy/MM/dd"
								/>
							</MuiPickersUtilsProvider>
						</div>
						
						<TextField label="Distance to pop (km)"
						           variant="outlined"
						           style={{marginLeft: "8px"}}
						           name="distanceToPop"
						           error={isNaN(timestamp.distanceToPop) ? "Are you fucking retarded?" : null}
						           helperText={isNaN(timestamp.distanceToPop) ? "Are you fucking retarded?" : null}
						           value={timestamp.distanceToPop}
						           onChange={(ev) => this.props.updateTimestamp(timestamp.id, ev)}/>
						{/*<ListItemText*/}
						{/*	primary={timestamp.time.toString()}*/}
						{/*	secondary={'Secondary text'}*/}
						{/*/>*/}
						<ListItemSecondaryAction>
							{/* eslint-disable-next-line react/jsx-no-undef */}
							<IconButton edge="end"
							            aria-label="delete"
							            onClick={() => this.props.removeTimestamp(timestamp.id)}>
								<DeleteIcon/>
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				})}
			</List>
			<Divider/>
			<Button onClick={this.props.addTimestamp} style={{marginTop: "8px"}}>Add bookmark</Button>
		</div>
	}
}

export default (MoonPresent)
