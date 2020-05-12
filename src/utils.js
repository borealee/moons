import {max, parseISO} from "date-fns";

export const maxTimestamp = (timestamps) => {
	const times = timestamps.map(ts => {
		if (typeof ts.time == "string") {
			return parseISO(ts.time)
		}
		else return parseISO(ts.time.toISOString())
	});
	
	console.log("times ", times)
	return max(times);
};