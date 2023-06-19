#! rm tada_js_merged.js && deno run --allow-read tada_merge_scripts.js >> tada_js_merged.js #
// #! deno run --allow-read

// Merged 'tada_js.js' with 'tada_data_merge.js' >> 'tada_js_merged.js'





// 'tab' character for file usage
const tab = '    ';


// this function executes the actual insertion of the 'dataMergeCode' into the 'templateJSFile'
// to-do: automatically match indentation
function mergeFiles(dataMergeCode, templateJSFile) {
    // indent each line
    dataMergeCode = tab + dataMergeCode.replaceAll('\n', '\n' + tab);
    // console.log(dataMergeCode);

    let inReplaceSection = false;
    let textToReplace = '';

    // find the '...start' and '...end' blocks
    for (const line of templateJSFile.split('\n')) {
        // mark that the section was started
        if (line.includes('...start')) {
            inReplaceSection = true;
        }

        // do something with these lines
        if (inReplaceSection) {
            // console.log(line);
            textToReplace += '\n' + line;
        }

        // mark that the section was finished
        if (line.includes('...end')) {
            inReplaceSection = false;
        }
    }

    // get current date
    const time = (new Date()).toISOString();

    // file prefix
    const prefix = `
// Automatically generated file.
// Do not edit directly!

// Instead, see: 'tada_js.js' and 'tada_data_merge.js'

// Generated via: 'tada_data_merge.js' at ${time}



`

    const outputCode = prefix.replace('\n', '') + templateJSFile.replace(textToReplace, dataMergeCode);

    return outputCode;
}


// loads up both files and return the resulting merged code
async function getMergedJSCode() {
    // load up 'tada_js.js' file as text
    let templateJSFile = await Deno.readTextFile('tada_js.js');

    // load up 'tada_data_merge.js' as text
    let dataMergeCode = await Deno.readTextFile('tada_data_merge.js');

    // merge the code
    return mergeFiles(dataMergeCode, templateJSFile);
}

const isMain = import.meta.main;

if (isMain) {
    console.log(await getMergedJSCode());
}

export { mergeFiles, getMergedJSCode };