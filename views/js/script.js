function create_inventory_table() {
  document.getElementById("table").innerHTML = "";
  tableData("/inventory/table");
}

//Getting Table Data Util Function
function tableData(url) {
  return $.ajax({
    url: url,
    type: "GET",
    cache: false,
    success: function (html) {
      document.getElementById("table").innerHTML = html;
    },
  });
}

//When our document loads execute the following function

$(document).ready(function () {
  create_inventory_table();
});
