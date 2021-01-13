let average_values = [5, 12, 25, 50, 100, 1000];
let ids = ["global", "weighted", "best"];

function readAverage() {
    let separators = [" +", "="]
    let string = document.getElementById("average").value;
    let times = string.split("Time List:");
    times = times[times.length - 1];
    elements = times.replace(/@.*/g, " ").replace(/[\(\)\+\,(\n)]+/g, '').replace(/\[.*,+/g, " ").split(new RegExp(separators.join("|"), 'g'));
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].includes(":")) {
            values = elements[i].split(":");
            values[1] = Math.round((parseFloat(values[0]) * 60 + parseFloat(values[1])) * 100) / 100;
            values.shift();
            corrected = values.join("");
            elements[i] = corrected;
        }
    }
    times_array = elements.filter(element => (!isNaN(element) && element.slice(-1) !== ".") || element.includes("DNF") && element !== "");
    console.log(times_array);
    if (times_array[times_array.length - 1] === "") {
        times_array.pop()
    }
    return times_array;
}

function DNFCheck(e) {
    return e.includes("DNF");
}

function mean(times, magnitude) {
    times = times.slice(0)
    let sum = (arr) => {
        return arr.reduce((a, b) => Number(a) + Number(b));
    }
    let best = times.slice(0, magnitude).some(DNFCheck) ? "DNF" : sum(times.slice(0, magnitude)) / magnitude;
    for (let i = 1; i < times.length - magnitude; i++) {
        if (!times.slice(i, i + magnitude).some(DNFCheck)) {
            current = sum(times.slice(i, i + magnitude)) / magnitude
            if (current < best || best == "DNF") {
                best = current;
            }
        }
    }
    best = Math.round(best * 100) / 100
    if (!isNaN(best)) {
        stats(`Best mo${magnitude}`, best, "best_stats");
    }

}

function average(times, magnitude) {
    times = times.slice(0)
    const aox = (arr) => {
        let len = arr.length;
        let no_dnf = arr.filter((e) => {
            return !DNFCheck(e)
        })
        let bounds = Math.ceil(0.05 * len);
        let dnf_count = len-no_dnf.length;
        let final_length = len-(bounds);
        if (no_dnf.length >= len - bounds) {
            no_dnf.sort(function (a, b) {
                return Number(a) - Number(b)
            });

            for(let i=0; i<dnf_count; i++) {
                no_dnf.shift();
            }

            while(no_dnf.length > final_length) {
                no_dnf.shift();
                no_dnf.pop();
            }

            return (no_dnf.reduce((a, b) => Number(a) + Number(b)) / no_dnf.length);
        } else {
            return "DNF"
        }
    }
    let best = "DNF";
    let current;
    for (let i = 0; i < times.length - magnitude; i++) {
        current = aox(times.slice(i, i + magnitude));
        if (current < best || best == "DNF") {
            best = current;
        }
    }
    best = Math.round(best * 100) / 100
    if (!isNaN(best)) {
        stats(`Best ao${magnitude}`, best, "best_stats");
    }
}

function wmean(times) {
    times = times.slice(0)
    no_dnf = times.filter((e) => {
        return !DNFCheck(e)
    })
    no_dnf.sort(function (a, b) {
        return Number(a) - Number(b)
    })
    let sum = (arr) => {
        return arr.reduce((a, b) => Number(a) + Number(b));
    }
    half_length = Math.ceil(times.length / 2)
    if (no_dnf.length >= half_length) {
        while (no_dnf.length > half_length) {
            no_dnf.pop();
        }
        stats(`Weighted Mean`, Math.round(sum(no_dnf) * 100 / no_dnf.length) / 100, "weighted_stats")
    }
}

function waverage(times) {
    times = times.slice(0)
    no_dnf = times.filter((e) => {
        return !DNFCheck(e)
    })
    no_dnf.sort(function (a, b) {
        return Number(a) - Number(b)
    })
    let sum = (arr) => {
        return arr.reduce((a, b) => Number(a) + Number(b));
    }
    half_length = Math.ceil(times.length / 2);
    if (no_dnf.length >= half_length) {
        while (no_dnf.length > half_length) {
            no_dnf.pop();
        }
        let bounds = Math.ceil(0.05 * no_dnf.length);
        if (bounds !== 0) {
            for (let i = 0; i < bounds; i++) {
                no_dnf.shift();
                no_dnf.pop();
            }
        }
        stats(`Weighted Truncated Average`, Math.round(sum(no_dnf) * 100 / no_dnf.length) / 100, "weighted_stats")
    }
}

function gmean(times) {
    times = times.slice(0)
    let time_list = times.filter(e => !DNFCheck(e));
    let sum = time_list.reduce((a, b) => Number(a) + Number(b));
    stats("Mean (Without DNFs)", Math.round(sum * 100 / time_list.length) / 100, "global_stats");
}

function gaverage(times) {
    times = times.slice(0);
    let bounds = Math.ceil(0.05 * times.length);
    let time_list = times.filter(e => !e.includes("DNF"));
    time_list.sort(function (a, b) {
        return Number(a) - Number(b)
    });
    if (bounds !== 0) {
        for (let i = 0; i < bounds; i++) {
            time_list.shift();
            time_list.pop();
        }
    }
    let sum = time_list.reduce((a, b) => Number(a) + Number(b));
    stats("Truncated Average (Without DNFs)", Math.round(sum * 100 / time_list.length) / 100, "global_stats")
}

function NotDNFCount(times) {
    dnf = times.filter(e => !e.includes("DNF"));
    return dnf.length;
}

function stats(type, time, id) {
    let d = document.getElementById(id);
    let li = document.createElement("LI");
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
    let length = time_list.length
    if (length > 1) {
        gmean(time_list);
        gaverage(time_list);
        mean(time_list, 3);
        wmean(time_list);
        waverage(time_list);
        stats("Accuracy", `${Math.round((NotDNFCount(time_list)*10000/length))/100}%`, "global_stats")
        stats("Solves/Attempts", `${NotDNFCount(time_list)}/${length}`, "global_stats")
        average_values.forEach((a) => {
            if (length >= a) {
                average(time_list, a);
            }
        })
    } else if (length == 1 && !isNaN(time_list[0])) {
        gmean(time_list);
        stats("Accuracy", `${Math.floor((NotDNFCount(time_list)*10000/length))/100}%`, "global_stats")
        stats("Solves/Attempts", `${NotDNFCount(time_list)}/${length}`, "global_stats")
    }

}
