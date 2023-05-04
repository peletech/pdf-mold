import { fetchTada } from "./fetch_tada.js";

// const appID = "Z9Q2gMmj2m";  // Gerch's app
const appID = "YZjnq9mQPv";  // Gabriella's app
const pipeID = "698rd2QZwd";

let param1, param2, param3, param4;

// accept a command line argument for param3 (generate PDF or not)
[param3, param2] = Deno.args;
// // accept three command line arguments
// [param1, param2, param3] = Deno.args;

// default to the default arguments
param1 = param1 || "K2ejlOQo9B"; // Data-table ID
param2 = param2 || "W0VNq8rmlK"; // Record ID
// param2 = param2 || "m72NpJojwv"; // Record ID
param3 = param3 || "False";
// param4 = param4 || "False";

// to get the PDF: "deno run --allow-read --allow-net run_pipe.js K2ejlOQo9B W0VNq8rmlK True"

// save the start time
const startTime = new Date();

// load "run_pipe_request.json"
const runPipeRequest = await Deno.readTextFile("run_pipe_request.json");
const pipeRequestJSON = JSON.parse(runPipeRequest);

// // load file "tada_js.js" as a string
// const jsCode = await Deno.readTextFile("./tada_js.js");
// pipeRequestJSON.

pipeRequestJSON.params = {
  "um4": param1,
  "um5": param2,
  "um6": param3,
  "um7": param4,
};

// update the pipe ID
pipeRequestJSON.pipe.id = pipeID;

// call the API endpoint
const json = await fetchTada(appID, "pipes/test", pipeRequestJSON);

// check if the response is authorized
if (!json) {
  console.log('Error: Unauthorized. Please check the cookies in the browser.');
  // console.log(response);
  Deno.exit(1);
}

const result = json.data.body.pretty.result;

// end the timer
const endTime = new Date().getTime();
const timeDuration = endTime - startTime;

if (json.type === 'success') {
  if (result) {
    console.log('./tada_js.js\n')

    console.log(result);
    console.log();
    let totalTime =
      (result.pdf_generation_time || 0) +
      (result.merge_and_fetch_time || 0) +
      (result.post_results_time || 0)
    console.log(
      "Pipe ran for:",
      totalTime,
      "ms"
    )
    // console.log("Environmental overhead:", timeDuration - totalTime, "ms");
    console.log();
    console.log("PDF URL:", result.pdf_url);
  } else {
    let debugHint = '';
    // Google Apps Script Error with the JS
    let errorLine = json.data.body.raw.match(/(.*) \(line (\d+)\)/);
    let errorMatch = json.data.body.raw.match(/<div style=".*">(.*) \(line (\d+)\)<\/div><\/body><\/html>/);
    if (errorMatch) {
      let errorCode = errorMatch[1];
      errorCode = errorCode.replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');

      let serverResponse = errorCode.match(/Truncated server response: ({.*})/);
      if (serverResponse) {
        serverResponse = serverResponse[1];
        console.log("Response:", serverResponse);
        debugHint = errorCode.match(/(\(use .*\)) \(/);
        if (debugHint) {
          debugHint = debugHint[1];
        } else {
          debugHint = '';
        }
      } else {
        // console.log(`JS Error: \n\t"${errorCode}"`);
        // console.log('%c' + errorCode, 'text-decoration: italic');
        console.log('> ' + errorCode);
      }
      if (errorLine[2]) {
        let lineNumber = errorLine[2];
        console.log();
        console.log(` ./tada_js.js:${lineNumber} ${debugHint}`);
      }
    } else {
      console.log(json.data.body.raw);
    }
  }
} else {
  console.log(json);
  console.log("Error:", json.msg);
}