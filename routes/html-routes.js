// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads view.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/board.html"));
  });

  // cms route loads cms.html
  app.get("/cms", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/cms.html"));
  });

  // board route loads board.html
  app.get("/board", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/board.html"));
  });

  // neighbor route loads neighbor-manager.html
  app.get("/neighbor", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/neighbor-manager.html"));
  });

};
