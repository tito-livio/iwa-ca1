//Variables
let selectedCars = 0;
let totalAmount = 0;
let tax = 23;

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
          //Retriving Total Value and adding with selected car row's total value
          totalAmount += parseInt(rows[i].querySelector("#price").textContent);
          //Incrementing Quantity of the selected cars
          selectedCars++;
          //Calling our utility function to update the values in the DOM
          updateTotalAndQty();
        } else {
          //Retriving Total Value and subracting with unselected car row's total value
          totalAmount -= parseInt(rows[i].querySelector("#price").textContent);
          //Decrementing Quantity of the selected cars
          selectedCars--;
          //Calling our utility function to update the values in the DOM
          updateTotalAndQty();
          rows[i].classList.remove("selected");
        }
      });
  }
}

//Highlight element
let highlightCheckbox = document.getElementById("highlightECO");
//Adding change for value listener on the highlight checkbox
highlightCheckbox.addEventListener("change", function (event) {
  let rows = document.querySelectorAll("#inventoryTable tbody tr[id]");
  //If the checkbox is selected
  if (event.target.checked === true) {
    for (let i = 0; i < rows.length; i++) {
      //if the rows have correct attribute value
      if (rows[i].getAttribute("iseco") == "true") {
        //Add Eco highlight class
        rows[i].classList.add("eco-highligt");
      }
    }
  }
  //If the checkbox is not selected
  else {
    for (let i = 0; i < rows.length; i++) {
      //if the rows have correct attribute value
      if (rows[i].getAttribute("iseco") == "true") {
        //Remove Eco highlight class
        rows[i].classList.remove("eco-highligt");
      }
    }
  }
});

let billButton = document.getElementById("calcBill");
//Adding Event listner of calculate bill button
billButton.addEventListener("click", function () {
  //Getting Numbers of Cars Selected
  document.getElementById("total-cars").textContent = selectedCars;
  //Getting Numbers of Total Amount
  document.getElementById("cost-price").textContent = totalAmount;
  //Getting VAT
  document.getElementById("vat").textContent = tax;
  //Calculating Amount Payable and then setting it
  document.getElementById("amount-payable").textContent =
    totalAmount + totalAmount * (tax / 100);
});

//Utility Function

//Function for updating Total Amount in the Input Field
//and the number of quantity of selected cars

function updateTotalAndQty() {
  document.getElementById("selectedCars").textContent = selectedCars;
  document.getElementById("totalAmount").value = totalAmount;
}

//When our document loads execute the following function

window.addEventListener("load", function () {
  render_inventory_table();
});
