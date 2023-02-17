let str = "226578";

let minute = Math.floor(parseInt(str) / 1000 / 60);
let second = Math.floor((parseInt(str) / 1000) % 60);
// minute = minute < 10 ? "0" + minute : minute;
second = second < 10 ? "0" + second : second;
console.log(minute, second);
