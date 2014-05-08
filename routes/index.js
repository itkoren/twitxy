/*
 * GET index page.
 */
module.exports = function(app) {
    var twit = app.get("twit");

	  return function(req, res, next){
        var term = req.query.term;
        var count = req.query.count || 10;
        var language = req.query.lang;
        var searcher = {
            q: term,
            count: count
        };

        if (!searcher.q) {
            console.log("Twitter search failed!");
            console.log("Query parameters are missing");
            res.send(404, "** Only Bear Here :) **");
        }
        else {
            if (language) {
                searcher.q += " lang:en";
                searcher["language"] = language;
            }

            twit.get("search/tweets", searcher, function(err, data) {
                if (err) {
                    console.log("Twitter search failed!");
                    console.log(err);
                    res.send(404, "** Only Bear Here :) **");
                }
                else {
                    res.send(data);
                }
            });
        }
	  };
};
