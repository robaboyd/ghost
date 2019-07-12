$(document).ready(function() {
  var sPositions = localStorage.positions || "{}",
    positions = JSON.parse(sPositions);
$.each(positions, function (id, pos) {
    $("#" + id).css(pos)
})
  // $("#time").draggable({cursor: "move", containment: "parent",  scroll: false,
  // stop: function (event, ui) {
  //     positions[this.id] = ui.position
  //     localStorage.positions = JSON.stringify(positions)
  // }});
  // $("#weather").draggable({cursor: "move", containment: "parent", scroll: false,
  // stop: function (event, ui) {
  //     positions[this.id] = ui.position
  //     localStorage.positions = JSON.stringify(positions)
  // } });
})