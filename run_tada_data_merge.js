#!deno run --allow-read

// get table and fields data
let Report_Data = JSON.parse(await Deno.readTextFile('tadabase_record.json'))['item'];
let Table_Fields = JSON.parse(await Deno.readTextFile('tada_fields.json'))['fields'];
let Client_Data = JSON.parse(await Deno.readTextFile('client_data.json'))['item'];

// console.log(Report_Data);

// needed vars (Image replacement)
var Tadabase_Content_Base = 'https://8232-application-data-2273.s3.amazonaws.com/';
var Kit_Cover_Base = 'https://ik.imagekit.io/ws6ojwiqv/tr:n-cover_photo/';
var Kit_Half_Page_Base = 'https://ik.imagekit.io/ws6ojwiqv/tr:n-scale_down_600/';


// "import" tada_data_merge.js
let tadaMergeCode = await Deno.readTextFile('tada_data_merge.js')
let e = eval(tadaMergeCode + '\nMerged_Data;');


console.log(`\n---\n${(new Date).toTimeString()}:`)

console.log('Output:', e);
console.log();

// console.log('Visual_Assessment:', e.visual_assessment); // ✓
// console.log('Treatment_Process:', e.treatment_process); // ✓
// console.log(mergedData);
// // console.log(getMatchingFields);
// // console.log(Merged_Data);