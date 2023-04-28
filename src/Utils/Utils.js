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

export const getDateInMsAsString = (creationDate) => {
    const timeInMs = parseInt(creationDate);
    const date = new Date(timeInMs);

    //data.getMonth() + 1 because months are 0-11
    return `
        ${date.getDate() < 10 ? `0${date.getDate()}`: date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours() < 10 ? `0${date.getHours()}`: date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}`: date.getMinutes()}:${date.getSeconds() < 10 ? `0${date.getSeconds()}`: date.getSeconds()}`;
}