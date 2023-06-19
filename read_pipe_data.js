#! deno run --allow-net --allow-read

// Simple command-line utility that fetches the contents (code) from the TadaBase backend and displays it in the console

const appID = "YZjnq9mQPv";
const pipeID = "698rd2QZwd";
const pipeSection = 1;

console.log(`Getting pipe data for pipe ${pipeID} [${pipeSection}]...\n`);

import { tada_cookie } from "./get_cookie.js";

const response = await fetch(
    `https://build.tadabase.io/webapi/v1/client/apps/${appID}/get/settings`, {
    "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,he;q=0.7",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-tb-builder": "0",
        "x-xsrf-token": "eyJpdiI6ImtlbllXeEZxU1Jld1dyRFVJbkoxRHc9PSIsInZhbHVlIjoicjJveDlmNGRkbGxsekFBQmxweFp1MW4yNVprNW02VXF6OTFFMk5lRTZSdjF4WXZ4WWw1ZHp0Z20yT3NtY0RcL1kiLCJtYWMiOiI2MDA5MmVkMTg4ZWQ0MGExZjA4NDhkNTliYjhjN2RjYjY5NDNmZjMyNTdhOWZiNWRlOTE1MTdmZmY5ZDZkMWEwIn0=",
        "cookie": tada_cookie,
        "Referer": "https://build.tadabase.io/apps/manage/Z9Q2gMmj2m/pipes/698rd2QZwd/api-calls",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
});

// parse JSON response
const responseJSON = await response.json();
// get pipe data
const pipeJSON = responseJSON.item.pipes[pipeID];

console.log(`JS Code for "${pipeJSON.name}" Pipe (${pipeJSON.id})`);
console.log(pipeJSON.metas.methods[pipeSection].rawBody);