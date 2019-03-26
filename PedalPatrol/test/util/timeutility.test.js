import TimeUtil from '@/src/util/timeutility';

test('should get timeago from milliseconds', () => {
	expect(TimeUtil.getTimeAgoFromMilliseconds((new Date()).getTime())).toBe('0s');
});

test('should parse milliseconds into readable time', () => {
	expect(TimeUtil.parseMillisecondsIntoReadableTime(1551406621940)).toBe('430946:17:01');
});

// test('should get formatted date from milliseconds', () => {

// 	if ((new Date()).getTimezoneOffset === 100) {
// 		expect(TimeUtil.getDateFormatFromDateTime(1551406621940)).toBe('2:17 - 1/3/2019');
// 	} else {
// 		expect(TimeUtil.getDateFormatFromDateTime(1551406621940)).toBe('21:17 - 28/2/2019');
// 	}

// });