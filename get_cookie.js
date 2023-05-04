// Utility function used by the tadabase dev-ops tools (tada_fetch, run_pipe, update_pipe, etc.)
// Fetches the cookie from the cake file, and then exports it as 'tada_cookie'



// load text of "tada_cake.txt" into variable "tada_cookie"
const tada_cookie = await Deno.readTextFile("tada_cake.txt");

// export cookie
export { tada_cookie };