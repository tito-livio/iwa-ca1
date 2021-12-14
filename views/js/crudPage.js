//Function To Render The Inventory Table in the HTML
function render_inventory_table() {
  //Setting the parent div to empty to remove any old tables/unesscary data
  document.getElementById("table").innerHTML = "";
  //Calling Utility function which renders the table
  tableData("/inventory/table");
}

//Hover function for rows
function HoverRow() {
  //Retrive all the table rows
  let rows = document.querySelectorAll("#inventoryTable tbody tr[id]");
  //Loop through loops and add event lister "hover/mouseover" on them as our cursor hovers over them
  //remove any rows that have hovered class which is the highlight color for the row.
  for (let i = 0; i < rows.length; i++) {
    rows[i].addEventListener("mouseover", function (event) {
      for (let i = 0; i < rows.length; i++) {
        rows[i].classList.remove("hovered");
      }
      //Highlight only that row on which our cursor is current at (Buy adding the hovered class again)
      event.currentTarget.classList.add("hovered");
    });
  }
}

//Car Row Number
let carRow = -1;
let carType = -1;
//Selection function for rows
function SelectRow() {
  //Retrive all the table rows
  let rows = document.querySelectorAll("#inventoryTable tbody tr[id]");

  //Loop through loops and add event lister "click" on them as our cursor clicks the checkbox
  for (let i = 0; i < rows.length; i++) {
    rows[i]
      .querySelector("td input") //As mentioned we are adding click listener on the checkbox only for selection feature
      .addEventListener("click", function (event) {
        if (event.target.checked === true) {
          for (let i = 0; i < rows.length; i++) {
            rows[i].querySelector("td input").setAttribute("disabled", "true");
          }
          //Getting Values of the row
          let name = rows[i].querySelector("#name").textContent;
          let price = rows[i].querySelector("#price").textContent;
          let fuelType = rows[i].querySelector("#fuelType").textContent;
          let category =
            $(rows[i]).prevAll("tr").children("td[colspan='4']").length - 1;
          //Getting the Car Type and The Row details from the table rows
          carRow = rows[i].getAttribute("id") - 1;
          carType = category;
          //Filling those into the input fields
          document.getElementById("name").value = name;
          document.getElementById("price").value = price;
          document.getElementById("fuelType").value = fuelType;
          document.getElementById("sec_category").value = category;
          //Setting Selected Style and Disabling Select Option for the rest
          rows[i].classList.add("selected");
          event.currentTarget.removeAttribute("disabled");
        } else {
          for (let i = 0; i < rows.length; i++) {
            rows[i].querySelector("td input").removeAttribute("disabled");
          }
          //Removing Selected Style
          rows[i].classList.remove("selected");
          resetInputField();
        }
      });
  }
}
function deleteRow() {
  $("#delete").click(function () {
    if (
      document.getElementById("name").value != "" &&
      document.getElementById("price").value != "" &&
      document.getElementById("fuelType").value != "" &&
      document.getElementById("sec_category").value != ""
    ) {
      $.ajax({
        url: "/inventory/delete",
        type: "POST",
        data: {
          carType: carType,
          car: carRow,
        },
        cache: false,
        success: setTimeout(render_inventory_table, 1000),
      });
      resetInputField();
    } else {
      alert("Please Select any row!");
    }
  });
}
//Utility Function
//Utility Function for Rendering Table with Data
function tableData(url) {
  //Making an AJAX GET REQUEST to our API
  return $.ajax({
    url: url,
    type: "GET",
    cache: false,
    success: function (html) {
      //If it's successful set the html content inside the parent div
      document.getElementById("table").innerHTML = html;
      //Call our row functions once we have rendered the HTML
      HoverRow();
      SelectRow();
    },
  });
}
//Utlity Function for Clearing Input fields
function resetInputField() {
  //Reset Input Fields
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("fuelType").value = "Diesel";
  document.getElementById("sec_category").value = 0;
}
//When our document loads execute the following function

window.addEventListener("load", function () {
  render_inventory_table();
  document.getElementById("delete").addEventListener("click", deleteRow());
});
