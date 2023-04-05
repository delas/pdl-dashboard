// Code from: https://stackoverflow.com/questions/13903897/javascript-return-number-of-days-hours-minutes-seconds-between-two-dates
export function dateDifferenceCalculator(date1, date2) { // date1 is the older date
    // get total seconds between the times
    var delta = Math.abs(date2 - date1);// / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / (86400 * 1000));
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / (3600 * 1000)) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / (60 * 1000)) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = Math.floor(delta / 1000) % 60;
    delta -= seconds * 60;

    var miliseconds = delta;
    // var seconds = delta % 60;  // in theory the modulus is not required
    // delta -= seconds * 60;

    return {days: days, hours: hours, minutes: minutes, seconds: seconds, miliseconds: miliseconds};
}