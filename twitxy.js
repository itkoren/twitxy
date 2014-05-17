/**
 * Module dependencies.
 */
var sys = require("sys");
var http = require("http");
var path = require("path");
var domain = require("domain");
var toobusy = require("toobusy-js");
var express = require("express");
var favicon = require("serve-favicon");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var morgan = require("morgan");
var errorhandler = require("errorhandler");
var responseTime = require("response-time");
var twitter = require("twit");
var keys = require("./keys.json");

var app = express();

var routes = require("./routes");
var stream = require("./routes/stream");

var dmn = domain.create();

dmn.on("error", function(err) {
    console.log(err);
});

dmn.run(function() {

    if ("development" === app.get("env")) {
        // Gets called in the absence of NODE_ENV too!
        app.use(function (req, res, next) {
            // you always log
            console.error(" %s %s ", req.method, req.url);
            next();
        });
        app.use(morgan({ format: "dev", immediate: true }));
        app.use(errorhandler({ dumpExceptions: true, showStack: true }));
    }
    else if ("production" === app.get("env")) {
        app.use(errorhandler());
    }

    // all environments
    app.set("port", process.env.PORT || 8000);
    app.set("ip", process.env.IP || "0.0.0.0");
    app.set("twit", new twitter(keys));

    app.use(function (req, res, next) {
        if (toobusy()) {
            res.send(503, "No tweets for you! Come back - one year!!! Very busy right now, sorry.");
        } else {
            next();
        }
    });

    app.use(favicon(__dirname + "/public/twitxy.ico"));
    app.use(bodyParser());
    app.use(methodOverride());

    app.get("/", routes(app));
    app.get("/stream", stream(app));

    app.use(function(err, req, res, next){
        console.error(err.stack);
        sys.puts("Caught exception: " + err);

        if (404 === err.status) {
            res.send(404, "** Only Bear Here :) **");
        }
        else {
            res.send(500, "Something broke!");
        }
    });
    // Add the responseTime middleware
    app.use(responseTime());
});

var server = http.createServer(app).listen(app.get("port"), app.get("ip"), function(){
    var addr = server.address();
    console.log("Express Server listening at", addr.address + ":" + addr.port);
});

process.on("uncaughtException", function (err) {
    console.error((new Date()).toUTCString() + " uncaughtException:", err.message);
    console.error(err.stack);

    sys.puts("Caught exception: " + err);
    process.exit(1);
});
