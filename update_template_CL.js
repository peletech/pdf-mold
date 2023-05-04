// This script updates the specified CloudLayer template with the contents of the "template_file.html" file



// base64 encoding
import { encode } from "https://deno.land/std/encoding/base64.ts";

// template info
// const templateID = "Srh1NZcJmx4HeHjkpkfQ"; // new template
const templateID = "Srh1NZcJmx4HeBuspkfQ"; // new template
// const templateID = "535xxJJ9hAjBP1h1sswr"; // old template
const templateName = "Mold Report"
import { apiToken } from "./CL_token.js";


// read in JSON file: "CL_Template_Request.json"
const file = await Deno.readTextFile("CL_Template_Request.json");
const requestJSON = JSON.parse(file);

// read in "template_file.html"
const templateFile = await Deno.readTextFile("template_file.html");
// convert it to base64 text
const templateFileBase64 = encode(templateFile);

// use blank template data
const templateJSON = {};

// Update the template file in the JSON request
requestJSON.template = templateFileBase64;
// Update the template data in the JSON request
requestJSON.sampleData = templateJSON;
// update the template ID in the JSON request
requestJSON.uid = templateID;
// update the template name in the JSON request
requestJSON.title = templateName;

// save the new JSON request to a file
await Deno.writeTextFile("CL_Template_Request_Updated.json", JSON.stringify(requestJSON, null, 4));


console.log('Updating template HTML and JSON data...', `(Template ID: ${templateID})`, '\n');

const request = await fetch(
    `https://api.cloudlayer.io/user/templates/${templateID}?clone=false`,
    // 'https://api.cloudlayer.io/user/templates',
    {
        "headers": {
            "content-type": "application/json",
            "token": apiToken,
        },
        "body": JSON.stringify(requestJSON),
        "method": "POST"
    });

const response = await request.json();

if (response.status == "success") {
    console.log(`https://app.cloudlayer.io/editor?id=${response.data.id}`);
} else {
    console.log('\n', 'Error updating template HTML and JSON data!', '\n');
    console.log(response);
}
