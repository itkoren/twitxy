/*
 * GET stream page.
 */
module.exports = function(app) {
    var twit = app.get("twit");

	  return function(req, res, next){
        var term = req.query.term;
        var language = req.query.lang;
        var searcher = {
            track: term
        };

        if (!searcher.q) {
            console.log("Twitter search failed!");
            console.log("Query parameters are missing");
            res.send(404, "** Only Bear Here :) **");
        }
        else {
            if (language) {
                searcher["language"] = language;
            }

            var stream = twit.stream("statuses/filter", searcher);

            stream.on("tweet", function (tweet) {
                res.send(data);
            });

            stream.on("disconnect", function (disconnectMessage) {
                res.end("Finitto La PiPitto!!!!");
            })
        }
	  };
};
