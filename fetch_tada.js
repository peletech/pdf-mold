import { tada_cookie } from "./get_cookie.js";

// call backend API on tadabase using cookies, etc.
// returns the JSON response if successful
// returns false if the response is unauthorized
async function fetchTada(appID, urlPath, jsonBody=None, cookieStr=tada_cookie) {
    const response = await fetch(
        `https://build.tadabase.io/webapi/v1/client/apps/${appID}/${urlPath}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "content-type": "application/json;charset=UTF-8",
            "x-tb-builder": "0",
            "cookie": cookieStr,
            "Referer": "https://build.tadabase.io/apps/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": JSON.stringify(jsonBody),
        "method": "POST"
    });

    // return response;

    let responseText = await response.text();
    if (responseText == "Unauthorized.") {
        console.log('Error: Unauthorized. Please check the cookies in the browser.');
        return false;
    } else {
        return JSON.parse(responseText);
    }
}

export { fetchTada };