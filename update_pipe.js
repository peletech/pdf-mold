#! deno run --allow-read --allow-net

// updates a tada pipe with the code in "tada_js.js"

import { fetchTada } from "./fetch_tada.js";


// app id, pipe id, and section number (in "API Calls")
// // https://build.tadabase.io/apps/manage/Z9Q2gMmj2m/pipes/698rd2QZwd/api-calls
// const appID = "Z9Q2gMmj2m";
// const pipeID = "698rd2QZwd";
// https://build.tadabase.io/apps/manage/YZjnq9mQPv/pipes/698rd2QZwd/api-calls
const appID = "YZjnq9mQPv";  // Gabriela's app
const pipeID = "698rd2QZwd"; // Gabriela's pipe

const pipeSection = "1";

import { getMergedJSCode } from "./tada_merge_scripts.js"

// load file "tada_js_merged.js" as a string
// const jsCode = await Deno.readTextFile("./tada_js_merged.js");
const jsCode = await getMergedJSCode();

// load the pipe-update json file
const body = await Deno.readTextFile("pipe_body.json");
let updatePipeJSON = JSON.parse(body);

// update the request JSON
updatePipeJSON.metas.methods[pipeSection].rawBody = jsCode;
updatePipeJSON.id = pipeID;

// update updatedAt and createdAt in the format "2023-03-19 08:13:04"
updatePipeJSON.createdAt = new Date().toISOString().replace("T", " ").slice(0, -5);
updatePipeJSON.updatedAt = updatePipeJSON.createdAt;


// call the API endpoint
const json = await fetchTada(appID, "save/pipes", updatePipeJSON);


// log the response body
if (json) {
    if (json.type == "success") {
        console.log(`Updated Pipe "${json.item.name}" with ID: "${json.item.id}".`);
        console.log(json.msg);
    } else {
        console.log("Error: ", json.msg);
    }
}
