// Description: Render a template using nunjucks
// Copyright: Elliot Gerchak

// use esm.sh to import nunjucks
import nunjucks from "https://esm.sh/nunjucks";

// import the template
const template = await Deno.readTextFile('./template_file.html');

// import the data
let data = await Deno.readTextFile('./sample_merged_data.json');

// render the template using the data
const renderedHTML = nunjucks.renderString(template, JSON.parse(data));

// write the rendered template to a file
await Deno.writeTextFile('./template_rendered.html', renderedHTML);