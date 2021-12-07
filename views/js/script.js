//Variables
let selectedCars = 0;
let totalAmount = 0;

//Function To Render The Inventory Table in the HTML
function render_inventory_table() {
  //Setting the parent div to empty to remove any old tables/unesscary data
  document.getElementById("table").innerHTML = "";
  //Calling Utility function which renders the table
  tableData("/inventory/table");
}

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

//Selection function for rows
function SelectRow() {
  //Retrive all the table rows
  let rows = document.querySelectorAll("#inventoryTable tbody tr[id]");
  //Loop through loops and add event lister "click" on them as our cursor clicks the checkbox
  for (let i = 0; i < rows.length; i++) {
    rows[i]
      .querySelector("td input") //As mentioned we are adding click listener on the checkbox only for selection feature
      .addEventListener("click", function (event) {
        //If the checked value is true then add selected class otherwise remove it
        if (event.target.checked === true) {
          rows[i].classList.add("selected");
          totalAmount += parseInt(rows[i].querySelector("#price").textContent);
          selectedCars++;
          updateTotalAndQty(totalAmount, selectedCars);
        } else {
          totalAmount -= parseInt(rows[i].querySelector("#price").textContent);
          selectedCars--;
          updateTotalAndQty(totalAmount, selectedCars);
          rows[i].classList.remove("selected");
        }
        //Once click add the selected class
      });
  }
}

//Utility Function

//Function for updating Total Amount in the Input Field
//and the number of quantity of selected cars

function updateTotalAndQty(total, qty) {
  document.getElementById("selectedCars").textContent = qty;
  document.getElementById("totalAmount").value = total;
}

//When our document loads execute the following function

window.addEventListener("load", function () {
  render_inventory_table();
});
