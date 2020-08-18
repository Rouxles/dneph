var averageString = ""

function readAverage() {
    let separators = [" +","="]
    let string = document.getElementById("average").value;
    let times = string.split("Time List:");
    times = times[times.length-1];
    elements = times.replace(/[\(\)\+\,(\n)]+/g,'').split(new RegExp(separators.join("|"),'g'));
    for(let i=0;i<elements.length;i++) {
        if(elements[i].includes(":")) {
            values = elements[i].split(":");
            values[1] = Math.round((parseFloat(values[0])*60 + parseFloat(values[1]))*100)/100;
            values.shift();
            corrected = values.join("");
            elements[i] = corrected;
        }
    }
    times = elements.filter(element => (!isNaN(element) && element.slice(-1) !== ".") || element.includes("DNF") && element !== "");
    return times;
}

function weightedFloor(times) {
    return Math.floor(times.length/2)
}

function mean(times,magnitude) {

}

function average(times,magnitude) {
    
}

function wmean(times,magnitude) {

}

function waverage(times,magnitude) {
    
}

function DNFCount(times) {
    dnf = times.filter(e => e.includes("DNF"))
    return dnf.length
}

function main() {
   let time_list = readAverage()
   let weighted_floor = weightedFloor(time_list)
   let dnf_count = DNFCount(time_list)
   console.log(time_list)
}