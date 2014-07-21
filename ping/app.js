var ping   = require("ping"),
    colors = require("colors"),
    async  = require("async"),
    _      = require("underscore");

colors.setTheme({
  ok: "green",
  warning: "yellow",
  fail: "red"
});

var list = require("./hosts-list.json");

console.time("Timer");

async.eachSeries(list, function (area, done) {

    console.log("Processing area %s:", area.name);

    async.map(area.hosts, pingHost, function (err, result) {
        showResult(result, area);
        done();
    });

}, function () {
    console.log("DONE");
    console.timeEnd("Timer");
});


function pingHost(host, callback) {
    ping.sys.probe(host, function (alive) {
        console.log("  . host %s is %s", host, alive ? "OK".ok : "DEAD".fail);
        callback(null, alive);
    });
}   

function showResult(result, area) {
    if (_.every(result, _.indentity)) {
        console.log("  Area %s is ALIVE\n".ok, area.name);
    } else if (_.every(result, function (x) {return !x;})) {
        console.log("  Area %s is COMPLETELY DEAD\n".fail, area.name);
    } else {
        console.log("  Area %s is NOT FULLY ALIVE\n".warning, area.name);
    }
}
