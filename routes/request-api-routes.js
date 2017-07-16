// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the requests
  app.get("/api/requests", function(req, res) {
    var query = {};
    if (req.query.neighbor_id) {
      query.NeighborId = req.query.neighbor_id;
    }
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Neighbor
    db.Request.findAll({
      where: query,
      include: [db.Neighbor]
    }).then(function(dbRequest) {
      res.json(dbRequest);
    });
  });

  // GET route for retrieving a single request
  app.get("/api/requests/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Neighbor
    db.Request.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Neighbor]
    }).then(function(dbRequest) {
      res.json(dbRequest);
    });
  });

  // POST route for saving a new request
  app.post("/api/requests", function(req, res) {
    db.Request.create(req.body).then(function(dbRequest) {
      res.json(dbRequest);
    });
  });

  // DELETE route for deleting requests
  app.delete("/api/requests/:id", function(req, res) {
    db.Request.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbRequest) {
      res.json(dbRequest);
    });
  });

  // PUT route for updating requests
  app.put("/api/requests", function(req, res) {
    db.Request.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbRequest) {
        res.json(dbRequest);
      });
  });
};
