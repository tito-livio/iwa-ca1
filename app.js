const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const xmlParse = require("xslt-processor").xmlParse;
const xsltProcess = require("xslt-processor").xsltProcess;
const xml2js = require("xml2js");
const { body, validationResult } = require("express-validator");

/**
 * -----------USAGE FOR EACH MODULE----------
 *
 * express: Handling HTTP requests, creates routes that will be used to render back content which is defined for that route
 * path: Working with file and directory paths using it's utilities that it provides.
 * fs: Read and Write files that are in the server's file system.
 * xmlParse: Utilize XML file capabilities
 * xsltProcess: Utilize XSL file capabilities (such as transformation)
 * xml2js: This module does XML to JSON conversion and also allows us to get from JSON back to XML
   express-validator: This module provides us features for input-sanitizatiion
 */

//Defining the directory from where our static data will be served from by express
app.use(express.static(path.join(__dirname, "views")));
//We allow the data sent from the client to be coming in as part of the URL in GET and POST requests
app.use(express.urlencoded({ extended: true }));
//We include support for JSON that is coming from the client
app.use(express.json());

//This endpoint which is the root endpoint will be responsible for rendering our homepage from the static content
app.get("/", function (req, res) {
  res.render("index");
});

//End-Point to get all RAW JSON data
app.get("/inventory", function (req, res) {
  //Reading our XML file from the data directory
  let xml = fs.readFileSync("./data/inventory.xml", "utf8");
  let xmlData = xmlParse(xml); //Parsing our XML file
  //Converting XML to JSON
  xmlFileToJs("./data/inventory.xml", function (err, result) {
    if (err) throw err;
    //Sending JSON data
    res.status(200).contentType("application/json").send(result);
  });
});

//End-Point to get certain car in RAW JSON data
app.get("/inventory/search", function (req, res) {
  //Reading our XML file from the data directory
  let xml = fs.readFileSync("./data/inventory.xml", "utf8");
  let xmlData = xmlParse(xml); //Parsing our XML file
  let obj = req.body;
  //Converting XML to JSON
  xmlFileToJs("./data/inventory.xml", function (err, result) {
    if (err) throw err;
    //Sending JSON data
    let searchResult = result.carsList.carType[obj.carType].car[obj.car];
    res.status(200).contentType("application/json").send(searchResult);
  });
});

//This endpoint will be responsible of sending us the inventory records in form of table via xml and xsl files
app.get("/inventory/table", function (req, res) {
  //Reading our XML and XSL files from the data directory
  let xml = fs.readFileSync("./data/inventory.xml", "utf8");
  let xsl = fs.readFileSync("./data/inventory.xsl", "utf8");

  let xmlData = xmlParse(xml); //Parsing our XML file
  let xslTable = xmlParse(xsl); //Parsing our XSL file

  //Transforming Processing Our XML and XSL into document
  let result = xsltProcess(xmlData, xslTable);
  //Returning Client the HTML content with status code 200 which is highlighting that the request was successful
  res.status(200).contentType(".html").send(result.toString());
});

//Endpoint for creating a record of a car in the file
app.post(
  "/inventory/create",
  //Sanitizing Data that we are getting from the request
  [
    body("name").isLength({ min: 5 }).trim().escape(),
    body("price").isNumeric(),
    body("fuelType").isLength({ min: 3 }).trim().escape(),
    body("sec_category").isLength({ min: 1 }).trim().escape(),
  ],
  //Handling the request
  function (req, res) {
    //Taking out the required data
    let name = req.body.name;
    let price = req.body.price;
    let fuelType = req.body.fuelType;
    let sec_category = req.body.sec_category;
    //Debug code
    // console.log(req.body);
    //Get the validation result
    const errors = validationResult(req);
    //If there are errors of validation then send 400 code with errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Converting XML file to JSON
    xmlFileToJs("./data/inventory.xml", function (err, result) {
      //If there are errors throw them
      if (err) throw err;
      //Debug code
      // console.log(result.carsList.carType[2]);
      //Push the data as a record in the file
      result.carsList.carType[sec_category].car.push({
        name: name,
        price: price,
        fuelType: fuelType,
      });

      //Debug Code
      // console.log(JSON.stringify(result, null, "  "));
      //Convert it back into XML
      jsToXmlFile("./data/inventory.xml", result, function (err) {
        if (err) console.log(err);
      });
    });
    //Redirect to the page
    res.redirect("/crud.html");
  }
);

//Endpoint for deleting a specific record of a car in the file
app.post(
  "/inventory/delete",
  //Sanitizing Data that we are getting from the request
  [body("car").isNumeric(), body("carType").isNumeric()],
  //Handling the request
  function (req, res) {
    let obj = req.body;
    //Get the validation result
    const errors = validationResult(req);
    //If there are errors of validation then send 400 code with errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Debug Code
    // console.log(obj);
    //Converting XML file to JSON
    xmlFileToJs("./data/inventory.xml", function (err, result) {
      //If there are errors throw them
      if (err) throw err;
      //Delete the mentioned data
      delete result.carsList.carType[obj.carType].car[obj.car];

      //Debug Code
      // console.log(JSON.stringify(result, null, "  "));
      //Convert back to XML file
      jsToXmlFile("./data/inventory.xml", result, function (err) {
        if (err) console.log(err);
      });
    });
    //Redirect to page
    res.redirect("/crud.html");
  }
);
//Utility Functions

// Function to read in XML file and convert it to JSON
function xmlFileToJs(filename, cb) {
  var filepath = path.normalize(path.join(__dirname, filename));
  fs.readFile(filepath, "utf8", function (err, xmlStr) {
    if (err) throw err;
    xml2js.parseString(xmlStr, {}, cb);
  });
}

//Function to convert JSON to XML and save it
function jsToXmlFile(filename, obj, cb) {
  var filepath = path.normalize(path.join(__dirname, filename));
  var builder = new xml2js.Builder();
  var xml = builder.buildObject(obj);
  fs.unlinkSync(filepath);
  fs.writeFile(filepath, xml, cb);
}

module.exports = app;
