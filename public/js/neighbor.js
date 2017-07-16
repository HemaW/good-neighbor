$(document).ready(function() {
  // Getting references to the name input and neighbor container, as well as the table body
  var nameInput = $("#neighbor-name");
  var neighborList = $("tbody");
  var neighborContainer = $(".neighbor-container");
  // Adding event listeners to the form to create a new object, and the button to delete
  // an neighbor
  $(document).on("submit", "#neighbor-form", handleNeighborFormSubmit);
  $(document).on("click", ".delete-neighbor", handleDeleteButtonPress);

  // Getting the intiial list of Neighbors
  getNeighbor();

  // A function to handle what happens when the form is submitted to create a new Neighbor
  function handleNeighborFormSubmit(event) {
    event.preventDefault();
    // Don't do anything if the name fields hasn't been filled out
    if (!nameInput.val().trim().trim()) {
      return;
    }
    // Calling the upsertNeighbor function and passing in the value of the name input
    upsertNeighbor({
      name: nameInput
        .val()
        .trim()
    });
  }

  // A function for creating an neighbor. Calls getNeighbors upon completion
  function upsertNeighbor(neighborData) {
    $.post("/api/neighbors", neighborData)
      .then(getNeighbor);
  }

  // Function for creating a new list row for neighbors
  function createNeighborRow(neighborData) {
    var newTr = $("<tr>");
    newTr.data("neighbor", neighborData);
    newTr.append("<td>" + neighborData.name + "</td>");
    newTr.append("<td> " + neighborData.Requests.length + "</td>");
    newTr.append("<td><a href='/board?neighbor_id=" + neighborData.id + "'>Go to Requests</a></td>");
    newTr.append("<td><a href='/cms?neighbor_id=" + neighborData.id + "'>Create a Request</a></td>");
    newTr.append("<td><a style='cursor:pointer;color:red' class='delete-neighbor'>Delete Neighbor</a></td>");
    return newTr;
  }

  // Function for retrieving neighbors and getting them ready to be rendered to the page
  function getNeighbor() {
    $.get("/api/neighbors", function(data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createNeighborRow(data[i]));
      }
      renderNeighborList(rowsToAdd);
      nameInput.val("");
    });
  }

  // A function for rendering the list of neighbors to the page
  function renderNeighborList(rows) {
    neighborList.children().not(":last").remove();
    neighborContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      neighborList.prepend(rows);
    }
    else {
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no neighbors
  function renderEmpty() {
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger");
    alertDiv.html("You must choose a Neighbor before you can create a Request.");
    neighborContainer.append(alertDiv);
  }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    var listItemData = $(this).parent("td").parent("tr").data("neighbor");
    var id = listItemData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/neighbors/" + id
    })
    .done(getNeighbor);
  }
}); 
