module.exports = function (app, addon) {

    // Root route. This route will serve the `atlassian-connect.json` unless the
    // documentation url inside `atlassian-connect.json` is set
    app.get('/', function (req, res) {
        res.format({
            // If the request content-type is text-html, it will decide which to serve up
            'text/html': function () {
                res.redirect('/atlassian-connect.json');
            },
            // This logic is here to make sure that the `atlassian-connect.json` is always
            // served up when requested by the host
            'application/json': function () {
                res.redirect('/atlassian-connect.json');
            }
        });
    });

    // This is an example route that's used by the default "generalPage" module.
    // Verify that the incoming request is authenticated with Atlassian Connect
    app.get('/spunky-config', addon.authenticate(), function (req, res) {
            // Rendering a template is easy; the `render()` method takes two params: name of template
            // and a json object to pass the context in

            var pointsdata = [
                {host: 'http://localhost:2990', action: 'create-a-page', text: "Create a page", point: '10'},
                {host: 'http://localhost:2990', action: 'attachment_created', text: "Create a Attachment", point: '10'},
                {host: 'http://localhost:2990', action: 'attachment_updated', text: "Update a Attachment", point: '5'},
                {host: 'http://localhost:2990', action: 'blog_created', text: "Create a Blog", point: '20'}

            ];
            var data = {
                pointsdata: pointsdata,
                title: 'Spunky Configuration'
            };
            
            res.render('spunky-config',data);


        }
    );


    app.get('/spunky-config-submit', addon.authenticate(), function (req, res) {
            console.log("Configuration submit =====>>>>>");
            res.render('spunky-config', {
                title: 'Spunky Configuration'
                //issueId: req.query['issueId']
            });
        }
    );

    // Add any additional route handlers you need for views or REST resources here...
    addon.descriptor.modules.webhooks.forEach(function (webhook) {
        addon.on(webhook.event, function(evt, body, req){
            var d = new Date;
            //console.log();
            console.log(evt.bold.yellow.inverse);
            console.log(body);
            if(evt === "page_viewed"){
                console.log("======>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>page_viewed ")
            }
        });
    });


    // load any additional files you have in routes and apply those to the app
    {
        var fs = require('fs');
        var path = require('path');
        var files = fs.readdirSync("routes");
        for(var index in files) {
            var file = files[index];
            if (file === "index.js") continue;
            // skip non-javascript files
            if (path.extname(file) != "js") continue;

            var routes = require("./" + path.basename(file));

            if (typeof routes === "function") {
                routes(app, addon);
            }
        }
    }
};
