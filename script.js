let average_values = [5,12,25,50,100,1000];
let ids = ["global", "normal"];

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
    return Math.floor(times.length/2);
}

function mean(times,magnitude) {

}

function average(times,magnitude) {
    
}

function wmean(times,magnitude) {

}

function waverage(times,magnitude) {
    
}

function gmean(times) {
    let time_list = times.filter(e => !e.includes("DNF"));
    let sum = time_list.reduce((a,b) => Number(a)+Number(b));
    globalStats("Mean (Without DNFs)", Math.round(sum*100/time_list.length)/100);
}

function gaverage(times) {
    let time_list = times.filter(e => !e.includes("DNF"));
    let bounds = Math.floor(0.05*time_list.length);
    time_list.sort((a, b) => a - b);
    if (bounds !== 0) {
        for(let i = 0; i<bounds; i++) {
            time_list.shift();
            time_list.pop();
        }
    }
    let sum = time_list.reduce((a,b) => Number(a)+Number(b));
    globalStats("Truncated Average (Without DNFs)", Math.round(sum*100/time_list.length)/100)
}

function DNFCount(times) {
    dnf = times.filter(e => e.includes("DNF"));
    return dnf.length;
}

function globalStats(type, time) {
    let d = document.getElementById("global_stats");
    let li = document.createElement("LI");
    let p = document.createElement("P");
    let t = document.createTextNode(`${type}: ${time}`);
    li.appendChild(t);
    d.appendChild(li)
}

function clearStats(ids) {
    let i;
    ids.forEach(i => {
        document.getElementById(`${i}_container`).innerHTML = `<ul id="${i}_stats"></ul>`;
    })
}

function main() {
    clearStats(ids);
    let time_list = readAverage();
    let global_mean = gmean(time_list);
    let global_average = gaverage(time_list);
    let weighted_floor = weightedFloor(time_list);
    let dnf_count = DNFCount(time_list);
    console.log(global_mean, global_average);
}