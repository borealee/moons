import {max, parseISO, min} from "date-fns";

export const maxTimestamp = (timestamps) => {
	const times = timestamps.map(ts => {
		if (typeof ts.time == "string") {
			return parseISO(ts.time)
		}
		else return parseISO(ts.time.toISOString())
	});
	
	return max(times);
};

export const minTimestamp = (timestamps) => {
	const times = timestamps.map(ts => {
		if (typeof ts.time == "string") {
			return parseISO(ts.time)
		}
		else return parseISO(ts.time.toISOString())
	});
	
	return min(times);
};

export const persist = (key, value) => {
	localStorage.setItem(key, JSON.stringify(value))
};