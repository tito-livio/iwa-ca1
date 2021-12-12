const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const xmlParse = require("xslt-processor").xmlParse;
const xsltProcess = require("xslt-processor").xsltProcess;
xml2js = require("xml2js");

/**
 * -----------USAGE FOR EACH MODULE----------
 *
 * express: Handling HTTP requests, creates routes that will be used to render back content which is defined for that route
 * path: Working with file and directory paths using it's utilities that it provides.
 * fs: Read and Write files that are in the server's file system.
 * xmlParse: Utilize XML file capabilities
 * xsltProcess: Utilize XSL file capabilities (such as transformation)
 * xml2js: This module does XML to JSON conversion and also allows us to get from JSON back to XML

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

app.post("/inventory/create", function (req, res) {
  let obj = req.body;
  xmlFileToJs("./data/inventory.xml", function (err, result) {
    if (err) throw err;
    console.log(result.carsList.carType[2]);
    result.carsList.carType[obj.sec_category].car.push({
      name: obj.name,
      price: obj.price,
      fuelType: obj.fuelType,
    });

    //Debug Code
    // console.log(JSON.stringify(result, null, "  "));

    jsToXmlFile("./data/inventory.xml", result, function (err) {
      if (err) console.log(err);
    });
  });
  res.redirect("/crud.html");
});

app.post("/inventory/delete", function (req, res) {
  let obj = req.body;
  console.log(obj);
  xmlFileToJs("./data/inventory.xml", function (err, result) {
    if (err) throw err;

    delete result.carsList.carType[obj.carType].car[obj.car];

    //Debug Code
    // console.log(JSON.stringify(result, null, "  "));

    jsToXmlFile("./data/inventory.xml", result, function (err) {
      if (err) console.log(err);
    });
  });

  res.redirect("/crud.html");
});
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
