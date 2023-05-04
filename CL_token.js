// gets a new access (secure) token from Google API (for CloudLayer)

// get access token from the auth service
const apiToken = await getAccessToken();

// export the variable
export { apiToken };


// log token info if run as script in Deno
if (import.meta.main) {
    console.log('access_token: ' + access_token);
}

// get token
async function getAccessToken(refreshToken) {
    try {
        const tokenFile = await Deno.readTextFile("CL_token.json");
        const tokenJSON = JSON.parse(tokenFile);

        // return 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiRml2ZSBCb3JvIE1vbGQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FDQi1SNVRHeXNMcEJ5SnE3NE1ETkVYc2hKa252N2RQZDZvVjdsZk5nbU1tWDAwTl9OZGM0eHlhU2tWREpWd1lJUU1DY0FXS2ZEeFlzZVlmMmdUbmxIS3FWN04ySzNIeGNoNVZ0ZjNWc0VMZi1CQWl3dUZxNUMyekhPT1RJZk9jc2MxRmNHSlVsSTN3OEV6ZXY0dXRxYV9NNEU4c3RaSXJMRlFGWGtHS1ZNUHJJQlBkTldNcmVwRUtvdEdrZWV0NTJ0X1ZPMXhKcHRRN0JtaEd5bTZJVHF1T1kwUWdtTFpDTjViV1RhUGQ2cjhId0xaeGN1akwxUUYwTG5hZEpZS2lmUUtwX2tOazhFTUZtQjZVRXJyemRGZ0lBa2JaelA1b3Qzcy1fRXI2ZmRHZkEzdG92a1dtdEtHVXhqaTFnOTA2OE9qeE1IbzJnNDFibXY3dmhhQ2ZhbkJJeXRtdFgwaVFlY20xSDl4NFU4VEdzMjRUWmV6V2V1TXBMMlN6eFpNamhFYnRVN0FhNGs1ZzItaWpQSlhIN2FPQUNPdFNZbDMxTC1tNXRnZlRyRU9UYWplRE5XamRBQ1o5TGJLZE4zRmRsNEZQM3dldUtKdW5DakxIT2cwWUc0TUpFSUNjcXJQQm1fZ2stUEtWVnRFOEhGb0M5ZlN1X1NEdEJiLW9BNW0tXzYwSVN5bUQzeHVmVXhFLVlBT0hJbVBMWk1jWWtmR1NKS2dmZ25Gd3FnQVQ2QnlubDZtOU5rLTA0TDF6aEdIWVp3Q00yN1AyTC1heHZLSF9WZThVYmc4RzZxaXFWR0M1aEdtbnFpRXJMOUc4VWdlWUtHWUl0ZkJTUDdqcWtWMktQWXhrVTRRd3lQV3ZzSER5eHEtdHpoMHl5NU8wcmp0UmNwVXRwU2g2a095c1VTclRfa3hOczBwX0tlc29mOV9pdi1zT0VQN0x4MnVDVXRvQWNhQzZoQ3diMmRzelhUNmc2VUpfbktfemVBdzhhNVZ4dy1fa3c5NnhzdHdsSEk3UXhHaU5LNmJyVmw5d1Y5YXpsOTJ4LVlOLW8xMDlmVF9LR0hHd2swbVdOX25DTmljRUpFQ2NtaTV6YkJGcjY5d0Q2TmpaVkJaM1JMT0MtaGhwYVNjbFhGUTBqUVAzdzZCd3pXVGVpT3VvTGoxaWh2MnhYNWpLLUw0MlQzNW5CYmZRbjZuZ045clJINVVGZ0ZKekZ5WHpPc095UTdOamFYaklxa1hEV3NNMDhyMTdJSTZfU3NHcXVGVnZpU01nS3BIcT1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9wcm9kLWNsb3VkbGF5ZXJpbyIsImF1ZCI6InByb2QtY2xvdWRsYXllcmlvIiwiYXV0aF90aW1lIjoxNjgwNTQwODU1LCJ1c2VyX2lkIjoiTEhucVNEOUd2SGVvRTBOb09waFhVTzVLanFzMSIsInN1YiI6IkxIbnFTRDlHdkhlb0UwTm9PcGhYVU81S2pxczEiLCJpYXQiOjE2ODA1NDA4NTUsImV4cCI6MTY4MDU0NDQ1NSwiZW1haWwiOiJpbmZvQGZpdmVib3JvbW9sZC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJpbmZvQGZpdmVib3JvbW9sZC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.ou9tCKcJmvRcftlzVvu4F_4Z-2bn21SULqJayLSaxKe6Lib_LXwsn045FbVgBDQQqvz_unyM9BoPTEHYd-2RZrNgjdraYS2JPtEBmAOxKISwXHaGs8a5kEP1W_6dWISgB8laU3F43pfFgXzMFCETpsUJbzb8JOj90ff_ZfQG7ECD4O1PxjES7zGlTAsiXLAJn7iUKSDDRWRgdaICrxDPsOOgrThdl-OEvjl2cPDnWWNzHLdg9wcbBHE1jDD5tg-RqLcf21DcV5vVSzCMcwDgap9tjr_AxNwiXRsNhf_v7w8I6gSXyou0M35S6qRwCtXAoBgCmLk5MaF-rgkAHaKl1Q'
        // if (tokenJSON.access_token) {
        //     console.log(tokenJSON.access_token)
        //     return tokenJSON.access_token;
        // }

        // get token timing details
        const tokenTime = tokenJSON.time / 1000;
        const nowTime = (new Date()).getTime() / 1000;
        const difference = nowTime - (tokenTime);
        const tokenTimeLimit = Number(tokenJSON.expires_in) || 3600;

        // check if token is expired
        if (difference > tokenTimeLimit) {
            // get new token, save it, and return it
            return await getAndSaveAccessToken(refreshToken || tokenJSON.refresh_token);
        } else {
            // return access token from file
            return tokenJSON.access_token;
        }

    } catch (e) {
        // if token file is missing or empty...
        // get new token, save it, and return it
        return await getAndSaveAccessToken(refreshToken);
    }
}

// get token
async function getNewToken(refreshToken) {
    const newTokenRequest = await fetch(
        "https://securetoken.googleapis.com/v1/token?key=AIzaSyAuikiajkmPf32iCcBlVm43-odip_r2E3M", {
        "headers": {
            "accept": "*/*",
            "content-type": "application/x-www-form-urlencoded",
        },
        "body": 'grant_type=refresh_token&refresh_token=' + refreshToken,
        "method": "POST"
    });

    return await newTokenRequest.json();
}

// convenience function to get token and save it to file
async function getAndSaveToken(refresh_token) {
    // get token
    const tokenJSON = await getNewToken(refresh_token);
    // add in current time
    tokenJSON.time = (new Date()).getTime();

    // save token to file
    const tokenString = JSON.stringify(tokenJSON, null, 2);
    await Deno.writeTextFile("CL_token.json", tokenString);

    // return token
    return tokenJSON;
}

// convenience function to get token data, save it to file, and return only the 'access token'
async function getAndSaveAccessToken(refresh_token) {
    // get token and save
    const tokenJSON = await getAndSaveToken(refresh_token);
    return tokenJSON.access_token;
}
