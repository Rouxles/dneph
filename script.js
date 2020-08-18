var averageString = ""

function readAverage() {
    let separators = [" +","="]
    let string = document.getElementById("average").value;
    let times = string.split("Time List:");
    times = times[times.length-1]
    elements = times.replace(/[\(\)\+\,(\n)]+/g,'').split(new RegExp(separators.join("|"),'g'))
    times = elements.filter(element => (!isNaN(element) && element.slice(-1) !== ".") || element.includes("DNF"))
    console.log(times);
}

function hi() {

}