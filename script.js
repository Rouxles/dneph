let average_values = [5, 12, 25, 50, 100, 1000];
let ids = ["global", "weighted", "best", "best_weighted"];

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
        let dnf = arr.filter((e) => DNFCheck(e))
        let bounds = Math.ceil(0.05 * len);
        let final_array;
        if (no_dnf.length >= len - bounds) {
            no_dnf.sort(function (a, b) {
                return Number(a) - Number(b)
            });

            final_array = no_dnf.concat(dnf)

            let return_array = final_array.slice(bounds,len-bounds)

            return (return_array.reduce((a, b) => Number(a) + Number(b)) / return_array.length);
        } else {
            return "DNF"
        }
    }
    let best = "DNF";
    let current;
    for (let i = 0; i <= times.length - magnitude; i++) {
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
    ids.forEach(i => {
        document.getElementById(`${i}_container`).innerHTML = `<ul id="${i}_stats"></ul>`;
    })
}

function bestWeightedmo100(times) {
    let best;
    let best_index;
    let time_list;
    for (let i = 0; i <= times.length - 100; i++) {
        time_list = times.slice(i, i+100)
        no_dnf = time_list.filter((e) => {
            return !DNFCheck(e)
        })
        no_dnf.sort(function (a, b) {
            return Number(a) - Number(b)
        })
        let sum = (arr) => {
            return arr.reduce((a, b) => Number(a) + Number(b));
        }
        half_length = 50
        if (no_dnf.length >= 50) {
            while (no_dnf.length > 50) {
                no_dnf.pop();
            }
            if(!best || Math.round(sum(no_dnf) * 100 / no_dnf.length) / 100 < best) {
                best = Math.round(sum(no_dnf) * 100 / no_dnf.length) / 100
                best_index = i+1
            }
        }
    }
    stats(`Best Weighted Mean of 100`, best, "best_weighted_stats");
    stats(`Begins on Solve Number`, best_index, "best_weighted_stats");
    let graphData = times.slice(best_index, best_index+100);
    let noDNFGraphData = graphData.filter((e) => {
        return !DNFCheck(e)
    })
    drawGraph(noDNFGraphData)
}

function drawGraph(data) {

    let d = document.getElementById("chartContainer");
    let h = document.createElement("h3");
    let t = document.createTextNode("Best Weighted mo100 Solve Distribution:");
    d.appendChild(document.createElement("BR"));
    h.appendChild(t);
    d.appendChild(h);

    console.log(data);
    // set the dimensions and margins of the graph
    var margin = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 50
      },
      width = 400 - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#chartContainer")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

        // add the x Axis
        var x = d3.scaleLinear()
          .domain([Math.min(...data)-1, Math.max(...data)+1])
          .range([0, width]);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
      
        // add the y Axis
        var y = d3.scaleLinear()
          .range([height, 0])
          .domain([0, 0.3]);
        // svg.append("g")
        //   .call(d3.axisLeft(y));

        // Compute kernel density estimation
        var kde = kernelDensityEstimator(kernelEpanechnikov(stdev(data)/2), x.ticks(20))
        var density = kde(data)
      
        // Plot the area
        svg.append("path")
          .attr("class", "mypath")
          .datum(density)
          .attr("fill", "#007bff")
          .attr("opacity", "1")
          .attr("stroke", "#000")
          .attr("stroke-width", 2)
          .attr("stroke-linejoin", "round")
          .attr("d", d3.area()
            .curve(d3.curveBasis)
            .x(function (d) { return x(d[0]); })
            .y1(function (d) { return y(d[1]); })
            .y0(y(0))
          );
}

function kernelDensityEstimator(kernel, X) {
    return function (V) {
      return X.map(function (x) {
        return [x, d3.mean(V, function (v) {
          return kernel(x - v);
        })];
      });
    };
  }

  function kernelEpanechnikov(k) {
    return function (v) {
      return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
  }

function stdev(array) {
    let sum = (arr) => {
        return arr.reduce((a, b) => Number(a) + Number(b));
    }
    const n = array.length
    const mean = sum(array) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

function clearGraph() {
    document.getElementById("chartContainer").innerHTML = "";
}

function main() {
    clearStats(ids);
    clearGraph();
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
        if (length >= 100) {
            bestWeightedmo100(time_list)
        }
    } else if (length == 1 && !isNaN(time_list[0])) {
        gmean(time_list);
        stats("Accuracy", `${Math.floor((NotDNFCount(time_list)*10000/length))/100}%`, "global_stats")
        stats("Solves/Attempts", `${NotDNFCount(time_list)}/${length}`, "global_stats")
    }

}