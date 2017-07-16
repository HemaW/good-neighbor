$(document).ready(function() {
  // Getting jQuery references to the request body, title, form, and neighbor select
  var bodyInput = $("#body");
  var titleInput = $("#title");
  var cmsForm = $("#cms");
  var neighborSelect = $("#neighbor");
  // Adding an event listener for when the form is submitted
  $(cmsForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a request)
  var url = window.location.search;
  var requestId;
  var neighborId;
  // Sets a flag for whether or not we're updating a request to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the request id from the url
  // In '?request_id=1', requestId is 1
  if (url.indexOf("?request_id=") !== -1) {
    requestId = url.split("=")[1];
    getRequestData(requestId, "request");
  }
  // Otherwise if we have an neighbor_id in our url, preset the neighbor select box to be our neighbor
  else if (url.indexOf("?neighbor_id=") !== -1) {
    neighborId = url.split("=")[1];
  }

  // Getting the neighbors, and their requests
  getNeighbors();

  // A function for handling what happens when the form to create a new request is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the request if we are missing a body, title, or neighbor
    if (!titleInput.val().trim() || !bodyInput.val().trim() || !neighborSelect.val()) {
      return;
    }
    // Constructing a newRequest object to hand to the database
    var newRequest = {
      title: titleInput
        .val()
        .trim(),
      body: bodyInput
        .val()
        .trim(),
      NeighborId: neighborSelect.val()
    };

    // If we're updating a request run updateRequest to update a request
    // Otherwise run submitRequest to create a whole new request
    if (updating) {
      newRequest.id = requestId;
      updateRequest(newRequest);
    }
    else {
      submitRequest(newRequest);
    }
  }

  // Submits a new request and brings user to board page upon completion
  function submitRequest(post) {
    $.post("/api/requests", post, function() {
      window.location.href = "/board";
    });
  }

  // Gets request data for the current request if we're editing, or if we're adding to an neighbor's existing requests
  function getRequestData(id, type) {
    var queryUrl;
    switch (type) {
      case "request":
        queryUrl = "/api/requests/" + id;
        break;
      case "neighbor":
        queryUrl = "/api/neighbors/" + id;
        break;
      default:
        return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.NeighborId || data.id);
        // If this request exists, prefill our cms forms with its data
        titleInput.val(data.title);
        bodyInput.val(data.body);
        neighborId = data.NeighborId || data.id;
        // If we have a request with this id, set a flag for us to know to update the request
        // when we hit submit
        updating = true;
      }
    });
  }

  // A function to get neighbors and then render our list of neighbors
  function getNeighbors() {
    $.get("/api/neighbors", renderNeighborList);
  }
  // Function to either render a list of neighbors, or if there are none, direct the user to the page
  // to create an neighbor first
  function renderNeighborList(data) {
    if (!data.length) {
      window.location.href = "/neighbor";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createNeighborRow(data[i]));
    }
    neighborSelect.empty();
    console.log(rowsToAdd);
    console.log(neighborSelect);
    neighborSelect.append(rowsToAdd);
    neighborSelect.val(neighborId);
  }

  // Creates the neighbor options in the dropdown
  function createNeighborRow(neighbor) {
    var listOption = $("<option>");
    listOption.attr("value", neighbor.id);
    listOption.text(neighbor.name);
    return listOption;
  }

  // Update a given request, bring user to the board page when done
  function updateRequest(post) {
    $.ajax({
      method: "PUT",
      url: "/api/requests",
      data: post
    })
    .done(function() {
      window.location.href = "/board"; 
    });
  }
});
