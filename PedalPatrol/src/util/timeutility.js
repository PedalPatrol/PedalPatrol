/**
 * Utility class for time functions.
 */
class TimeUtility {
	/**
	 * Returns the milliseconds time formatted as 'HH:MM - DD/MM/YY'.
	 *
	 * @param {Number} datetime - The time in milliseconds
	 * @return {string} Milliseconds represented as a string
	 */
	getDateFormatFromDateTime(datetime) {
		let converted = new Date(datetime);
		let date = converted.getDate() + '/' + (converted.getMonth()+1) + '/' + converted.getFullYear();
		let time = converted.getHours() + ":" + converted.getMinutes();
		let dateTime = time+' - '+date;
		return dateTime
	}

	/**
	 * Returns millisecond time as a time ago string (# __ ago).
	 *
	 * @param {Number} milliseconds - The time in milliseconds
	 * @return {string} The millisecond time represented as a string
	 */
	getTimeAgoFromMilliseconds(milliseconds) {
		const currentTime = new Date();
		
		let time = this.parseMillisecondsIntoReadableTime(currentTime-milliseconds);

		let parsetime = time.split(':');
		let suffix = '';
		let outtime = '';

		const hours = parseInt(parsetime[0]);
		const minutes = parseInt(parsetime[1]);
		const seconds = parseInt(parsetime[2]);

		// console.log(hours, minutes, seconds);

		// Probably could make more concise
		if (hours >= 24) {
			outtime = Math.floor(hours/24); // Round to days
			suffix = 'd';

			if (outtime >= 30 && outtime < 365) { // 30 days - 365 days
				outtime = Math.floor(outtime/30); // Round to months
				suffix = 'mo';
			} else if (outtime >= 365) { // > 365 days
				outtime = Math.floor(outtime/365); // Round to years
				suffix = 'yr';
			}

		} else if (hours > 0) {
			outtime = hours;
			suffix = 'hr';

		} else {
			if (minutes > 0) {
				outtime = minutes;
				suffix = outtime === 1 ? ' min' : ' mins';
			} else {
				outtime = seconds;
				suffix = 's';
			}
		}

		return outtime + suffix;
	}

	/**
	 * Returns the milliseconds time as readable time (HH:MM:SS)
	 *
	 * @param {Number} milliseconds - The time in milliseconds
	 * @return {string} Milliseconds formatted to time
	 */
	parseMillisecondsIntoReadableTime(milliseconds){
		//  Get hours from milliseconds
		let hours = milliseconds / (1000*60*60);
		let absoluteHours = Math.floor(hours);
		let h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

		// Get remainder from hours and convert to minutes
		let minutes = (hours - absoluteHours) * 60;
		let absoluteMinutes = Math.floor(minutes);
		let m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

		// Get remainder from minutes and convert to seconds
		let seconds = (minutes - absoluteMinutes) * 60;
		let absoluteSeconds = Math.floor(seconds);
		let s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

		return h + ':' + m + ':' + s;
	}

	/**
	 * Quick sorts the data based on the timeago property. Arguably faster than using the built in sort function
	 * with a custom compare function.
	 *
	 * @param {List} data - Unsorted object data with a timeago property
	 * @return {List} Sorted data
	 */
	sortOnTime(data) {
		if (data.length <= 1) {
			return data;
		}

		let pivot = data[0];

		let left = []; 
		let right = [];

		for (let i = 1; i < data.length; i++) {
			data[i].milliseconds < pivot.milliseconds ? left.push(data[i]) : right.push(data[i]);
		}

		return this.sortOnTime(left).concat(pivot, this.sortOnTime(right));
	};

	/**
	 * Returns the current date and time in milliseconds.
	 * 
	 * @return {Number} The date and time in milliseconds
	 */
	getDateTime() {
		return (new Date()).getTime();
	}
}

const TimeUtil = new TimeUtility();
export default TimeUtil;