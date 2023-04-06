// CODE FROM: https://stackoverflow.com/questions/19700283/how-to-convert-time-in-milliseconds-to-hours-min-sec-format-in-javascript
export function msToTime(duration) {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const returnHours = hours > 0 ? `${hours}:` : "";
    const returnMinutes = (minutes > 0 || hours > 0) ? `${minutes}:` : "";
    const returnSeconds = seconds < 10 ? `0${seconds}:` : `${seconds}:`;
    let returnMilliseconds = "";
    if(milliseconds < 10) {
        returnMilliseconds = `00${milliseconds}`;
    } else if(milliseconds < 100) {
        returnMilliseconds = `0${milliseconds}`;
    } else {
        returnMilliseconds = `${milliseconds}`;
    }

    return `${returnHours}${returnMinutes}${returnSeconds}${returnMilliseconds}`;
}