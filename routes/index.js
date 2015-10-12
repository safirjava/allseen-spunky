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

            var baseUrl = req.query.xdm_e + req.query.cp;
            console.log("BaseUrl ==>>"+baseUrl);

            var pointsdata = [
                {host: baseUrl, action: 'create-a-page', text: "Create a page", point: '10'},
                {host: baseUrl, action: 'blog_created', text: "Create a Blog", point: '20'},
                {host: baseUrl, action: 'comment_created', text: "Create a comment", point: '3'},
                {host: baseUrl, action: 'label_added', text: "Label a page or blogpost", point: '3'},
                {host: baseUrl, action: 'status_created', text: "Write a Status Update", point: '2'},
                {host: baseUrl, action: 'following', text: "Follow someone", point: '2'},
                {host: baseUrl, action: 'followed', text: "Someone is following you", point: '10'},
                {host: baseUrl, action: 'space_created', text: "Create a Space", point: '20'},
                {host: baseUrl, action: 'blog_updated', text: "Edit a blogpost", point: '3'},
                {host: baseUrl, action: 'page_updated', text: "Edit a page", point: '3'},
                {host: baseUrl, action: 'search_performed', text: "Search for Content", point: '1'},
                {host: baseUrl, action: 'medel_receive', text: "Receive a medal", point: '30'}
            ];
            var data = {
                pointsdata: pointsdata,
                title: 'Spunky Configuration'
            };
            
            res.render('spunky-config',data);


        }
    );


    app.get('/spunky-config-submit', addon.checkValidToken(), function (req, res) {
            console.log("Configuration submit =====>>>>>");
            var baseUrl = req.query.xdm_e + req.query.cp;
            console.log("BaseUrl ==>>"+baseUrl);

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
