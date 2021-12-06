const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const xmlParse = require("xslt-processor").xmlParse;
const xsltProcess = require("xslt-processor").xsltProcess;

/**
 * -----------USAGE FOR EACH MODULE----------
 *
 * express: Handling HTTP requests, creates routes that will be used to render back content which is defined for that route
 * path: Working with file and directory paths using it's utilities that it provides.
 * fs: Read and Write files that are in the server's file system.
 * xmlParse: Utilize XML file capabilities
 * xsltProcess: Utilize XSL file capabilities (such as transformation)
 */

//Defining the directory from where our static data will be served from by express
app.use(express.static(path.join(__dirname, "views")));

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


module.exports = app;
