// Utility command line script in Node.js
// generates a PDF of an html file using puppeteer

// takes in a html file path and a pdf output file path as parameters
// defaults are './template_rendered.html' and './template_rendered_output.pdf'





// import browser automation library
const puppeteer = require('puppeteer');
// import path library
const path = require('path');


// start a timer to measure the time taken to generate the pdf file
console.time('generate_pdf');

// load up 'template_rendered.html' in the browser
// and save it as a pdf file

// accept an optional command line argument for the template file path
// if no argument is provided, use the default template file
const templateFilePath = process.argv[2] || './template_rendered.html';

// accept a second optional command line argument for the output file path
// if no argument is provided, use the default output file
const outputFilePath = process.argv[3] || './template_rendered_output.pdf';
const tempOutputPath = '/tmp/rendered_file.pdf';

// convert relative path to absolute path
const filePath = path.resolve(templateFilePath);

// convert filepath to url
const fileUrl = 'file://' + filePath;

// launch browser
(async () => {
    // launch chrome in headless mode
    const browser = await puppeteer.launch();
    // create a new page
    const page = await browser.newPage();
    // open the template file
    await page.goto(fileUrl);

    // wait for the '.pagedjs_area #dummyElement' element to appear on the page
    await page.waitForSelector('.pagedjs_area #dummyElement');

    // generate a pdf file from the template file
    // await page.pdf({ path: outputFilePath, format: 'A4' });
    // save to a different location to avoid triggering any file watchers
    await page.pdf({ path: tempOutputPath, format: 'A4' });
    await browser.close();

    // move from the temporary directory to the output directory
    const fs = require('fs');
    await fs.renameSync(tempOutputPath, outputFilePath);

    // log the output path of the pdf file
    console.log(`Generated PDF File (${templateFilePath} => ${outputFilePath})`);
    console.timeEnd('generate_pdf');
}
)();
