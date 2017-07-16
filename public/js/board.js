$(document).ready(function() {
  /* global moment */

  // boardContainer holds all of our requests
  var boardContainer = $(".board-container");
  var requestCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handleRequestDelete);
  $(document).on("click", "button.edit", handleRequestEdit);
  // Variable to hold our requests
  var requests;

  // The code below handles the case where we want to get board requests for a specific neighbor
  // Looks for a query param in the url for neighbor_id
  var url = window.location.search;
  var neighborId;
  if (url.indexOf("?neighbor_id=") !== -1) {
    neighborId = url.split("=")[1];
    getRequests(neighborId);
  }
  // If there's no neighborId we just get all requests as usual
  else {
    getRequests();
  }


  // This function grabs requests from the database and updates the view
  function getRequests(neighbor) {
    neighborId = neighbor || "";
    if (neighborId) {
      neighborId = "/?neighbor_id=" + neighborId;
    }
    $.get("/api/requests" + neighborId, function(data) {
      console.log("requests", data);
      requests = data;
      if (!requests || !requests.length) {
        displayEmpty(neighbor);
      }
      else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete requests
  function deleteRequest(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/requests/" + id
    })
    .done(function() {
      getRequests(requestCategorySelect.val());
    });
  }

  // InitializeRows handles appending all of our constructed request HTML inside boardContainer
  function initializeRows() {
    boardContainer.empty();
    var requestsToAdd = [];
    for (var i = 0; i < requests.length; i++) {
      requestsToAdd.push(createNewRow(requests[i]));
    }
    boardContainer.append(requestsToAdd);
  }

  // This function constructs a request's HTML
  function createNewRow(request) {
    var formattedDate = new Date(request.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newRequestPanel = $("<div>");
    newRequestPanel.addClass("panel panel-default");
    var newRequestPanelHeading = $("<div>");
    newRequestPanelHeading.addClass("panel-heading");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    var newRequestTitle = $("<h2>"); 
    var newRequestDate = $("<small>");
    var newRequestNeighbor = $("<h5>");
    newRequestNeighbor.text("Written by: " + request.Neighbor.name);
    newRequestNeighbor.css({
      float: "right",
      color: "blue",
      "margin-top":
      "-10px"
    });
    var newRequestPanelBody = $("<div>");
    newRequestPanelBody.addClass("panel-body");
    var newRequestBody = $("<p>");
    newRequestTitle.text(request.title + " ");
    newRequestBody.text(request.body);
    newRequestDate.text(formattedDate);
    newRequestTitle.append(newRequestDate);
    newRequestPanelHeading.append(deleteBtn);
    newRequestPanelHeading.append(editBtn);
    newRequestPanelHeading.append(newRequestTitle);
    newRequestPanelHeading.append(newRequestNeighbor);
    newRequestPanelBody.append(newRequestBody);
    newRequestPanel.append(newRequestPanelHeading);
    newRequestPanel.append(newRequestPanelBody);
    newRequestPanel.data("request", request);
    return newRequestPanel;
  }

  // This function figures out which request we want to delete and then calls deleteRequest
  function handleRequestDelete() {
    var currentRequest = $(this)
      .parent()
      .parent()
      .data("request");
    deleteRequest(currentRequest.id);
  }

  // This function figures out which request we want to edit and takes it to the appropriate url
  function handleRequestEdit() {
    var currentRequest = $(this)
      .parent()
      .parent()
      .data("request");
    window.location.href = "/cms?request_id=" + currentRequest.id;
  }

  // This function displays a messgae when there are no requests
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for Neighbor #" + id;
    }
    boardContainer.empty();
    var messageh2 = $("<h2>");
    messageh2.css({ "text-align": "center", "margin-top": "50px" });
    messageh2.html("No requests yet" + partial + ", navigate <a href='/cms" + query +
    "'>here</a> in order to get started.");
    boardContainer.append(messageh2);
  }

});
