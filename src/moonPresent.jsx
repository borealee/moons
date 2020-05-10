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
import {addHours, parseISO} from 'date-fns';

class MoonPresent extends Component {
	constructor(props) {
		super(props);
		this.date = new Date();
		console.log("props 111: " , this.props);
	}
	
	componentDidUpdate(prevProps, prevState, snapshot) {
		console.log("curr props: " , this.props)
	}
	
	render() {
		
		// console.log("Fucked up: " , this.props.timestampsFuckedUp);
		console.log("popsat: " , this.props.popsAt);
		let popsAt = this.props.popsAt;
		if (typeof this.props.popsAt == "string") {
			popsAt=parseISO(popsAt)
		}
		
		const validEstimation = `${addHours(popsAt, this.props.timeToPop).toString()} (± ${this.props.timeToPop} hrs)`
		return <div style={{display: "block", padding: "24px", width: "100%"}}>
			<Typography variant="h6">
				Moon pops: {this.props.timestampsFuckedUp ? "Fucked up timestamps" : validEstimation}
			</Typography>
			<Typography>
				Bookmarks
			</Typography>
			<Typography>{this.props.timestampsFuckedUp ? "Bro timestamps are fucked" : null}</Typography>
			<List dense={true}>
				{this.props.timestamps.map(timestamp => {
					return <ListItem key={timestamp.id} style={{marginTop: "8px"}}>
						{/*<ListItemAvatar>*/}
						{/*</ListItemAvatar>*/}
						<div style={{minWidth: "250px"}}>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<DateTimePicker
									emptyLabel={""}
									label="Date (use evetime dipshit)"
									// value={timestamp.time}
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
							<IconButton edge="end" aria-label="delete"
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
