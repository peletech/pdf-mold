// https://build.tadabase.io/apps/manage/Z9Q2gMmj2m/pipes/698rd2QZwd/api-calls
// "Concatenate Strings" section (uses G-App Engine)

// receives a data table id, a record id, and a "generatePDF" boolean (as a string)
// fetches and merges the report data and customer info (from the data table)

// returns various pieces of data, including the report data, customer info, and the address of the customer


// original calls to Tada API based on:
// https://docs.tadabase.io/categories/solution-guides/article/google-scripts---get-record-and-create-new-records-from-connected-table

/**************
*  Variables  *
**************/

// Tadabase API
var Tadabase_App_Id = 'YZjnq9mQPv';
var Tadabase_Api_Key = 'biyiNNR4Qwch';
var Tadabase_Api_Secret = 'B2ktYuclnwuBqbtRsKV7S4XIEAEJt3Wm';

// Document Generator
var Cloud_Layer_Template_ID = 'u-mold-report';  // new
var Cloud_Layer_API_Key = "cl-26d99b31c59740a692444a2484c06046" // new
var Report_Page_Size = 'letter';

// Image replacement
var Tadabase_Content_Base = 'https://8232-application-data-2273.s3.amazonaws.com/';
var Kit_600_Base = 'https://ik.imagekit.io/ws6ojwiqv/tr:n-scale_down_600/';
var Kit_Cover_Base = 'https://ik.imagekit.io/ws6ojwiqv/tr:n-cover_photo/';
var Kit_Half_Page_Base = Kit_600_Base

/*************
* API Settings
**************/
var Tadabase_Api_Url = 'https://api.tadabase.io/api/v1/data-tables';
var Request_Var_Tada = {
    'method': 'GET',
    'headers': {
        "X-Tadabase-App-id": Tadabase_App_Id,
        "X-Tadabase-App-Key": Tadabase_Api_Key,
        "X-Tadabase-App-Secret": Tadabase_Api_Secret
    },
    'contentType': 'application/json'
};

// time the merge and fetch process
var Merge_and_Fetch_Start = new Date().getTime();

// Define Table_Id, Record_ID, and Generate_PDF variables based on the Pipe's Parameters
var Table_Id = '{table}';
var Record_ID = '{record}';
var Generate_PDF = '{generatePDF}';


// Fetch request to get the report data record from the data table
var Get_Report_Data = {
    'url': `${Tadabase_Api_Url}/${Table_Id}/records/${Record_ID}`,
    ...Request_Var_Tada
}

var Get_Table_Fields = {
    'url': `${Tadabase_Api_Url}/${Table_Id}/fields`,
    ...Request_Var_Tada
}

// fetch using "UrlFetchApp.fetchAll()"
var Fetch_Response = UrlFetchApp.fetchAll([Get_Report_Data, Get_Table_Fields]);

// extract out the report data
var Report_Data = JSON.parse(Fetch_Response[0].getContentText()).item;

// extract out the table fields data
var Table_Fields = JSON.parse(Fetch_Response[1].getContentText()).fields;

// extract out the customer record id

if (Report_Data == 0) {
    exit = {
        'error': 'Could not generate report',
        'message': 'No data found. Tadabase record is missing. Contact customer support.',
        'data': Report_Data
    }
} else if (
    typeof Report_Data.field_84 === 'undefined' ||
    Report_Data.field_84.length <= 0
    ) {
    // throw JSON.stringify({
    exit = {
        'error': 'Could not generate report',
        'message': 'No Client Name. Field is missing.',
        'data': Report_Data
    };

    exit;
} else {
    var Client_Record_Id = Report_Data.field_84[0];
    // var Client_Record_Id = matchFieldByNameAuto('Client Name', Report_Data);
    
    // Fetch the client data record from the data table
    var Clients_Table_ID = 'eykNOvrDY3';
    var Fetch_Response = UrlFetchApp.fetch(`${Tadabase_Api_Url}/${Clients_Table_ID}/records/${Client_Record_Id}`, Request_Var_Tada);
    var Client_Data = JSON.parse(Fetch_Response).item;
    
    // Extract the address from the client data and merge it into a single string
    var Client_Address_JSON = Client_Data.field_173; // {"address":"54 Sunny Road","address2":"","city":"Johannesburg","state":"Gauteng","country":"South Africa","zip":"2192","lng":"28.1061642","lat":"-26.1384167"}
    var Client_Address = Client_Address_JSON.address;
    var Client_Location = `${Client_Address_JSON.city}, ${Client_Address_JSON.state} ${Client_Address_JSON.zip}`;
    
    
    // Functions to merge the data...
    
    /*
        Parameters: a regex, a key name, and the object to update, also optionally the data to use
    
        Function:
            updates the specified index with each match of the regex using specified key
    
            i.e. getMatchingFields(/room +d/, 'room', damageIndex) will create something that looks like this:
            ```
            damageIndex = {
                '1': {
                    'room': '[name of room]'
                },
                ...
            }
            ```
    
        returns an array of objects with the new key and the index
    
    */
    function getMatchingFields(fieldRegex, newKey, indexToUpdate, useData = Report_Data) {
        let matchingFields = [];
        for (const Table_Field in Table_Fields) {
            let match = Table_Fields[Table_Field].name.match(fieldRegex);
            if (match) {
                matchingFields.push({
                    [newKey]: useData[Table_Fields[Table_Field].slug],
                    'index': match[1]
                });
                indexToUpdate[match[1]] = indexToUpdate[match[1]] || {};
                indexToUpdate[match[1]][newKey] = useData[Table_Fields[Table_Field].slug];
            }
        }
        return matchingFields;
    }
    
    
    // generate regex from string for more flexible matching
    function generateRegexFromString(str, keepNumbers = false) {
        // make question marks optional
        str = str.replaceAll(/\?/g, '(\\?)?');
        // make colons optional
        str = str.replaceAll(/:/g, '(:)?');
    
        // make the spaces less strict or optional
        str = str.replaceAll(/ +/g, '(?:\\s+)?');
    
        // make numbers optional
        if (!keepNumbers)
        {
            str = str.replaceAll(/\d+/g, '(\\d+)?');
        }
    
        // make the words "the" and "of" optional
        str = str.replaceAll(/ the /g, ' (the )?');
        str = str.replaceAll(/ of /g, ' (of )?');
        // make the words "and" and "or" optional
        str = str.replaceAll(/ and /g, ' (and )?');
        str = str.replaceAll(/ or /g, ' (or )?');
        // make the words "a" and "an" optional
        str = str.replaceAll(/ a /g, ' (a )?');
        str = str.replaceAll(/ an /g, ' (an )?');
    
        // make the string a regex
        str = new RegExp(str, 'i');
    
        return str;
    }
    
    // convert all the values in an object to regex
    function convertObjectValuesToRegex(obj, keepNumbers = false) {
        for (const key in obj) {
            obj[key] = generateRegexFromString(obj[key], keepNumbers);
        }
        return obj;
    }
    
    // convenience function to use nameToObject with the convertToRegex function
    function nameToObjectAuto(sampleKeyObj, useData = Report_Data, keepNumbers = false) {
        let keyObj = convertObjectValuesToRegex(sampleKeyObj, keepNumbers = keepNumbers);
        let newObj = nameToObject(keyObj, useData);
    
        return newObj;
    }
    
    
    // match field by name/regex
    // takes the first match and returns the value of that match on the data object
    function matchFieldByName(fieldRegex, useData = Report_Data) {
        for (const Table_Field in Table_Fields) {
            let item = Table_Fields[Table_Field];
            let match = item.name.match(fieldRegex);
            if (match) {
                let slug = Table_Fields[Table_Field].slug;
                let matchedItm = useData[slug];
                return matchedItm;
            }
        }
        return null;
    }
    
    // convenience function to use matchFieldByName with the generateRegex function
    // effectively gives a more flexible way to match fields
    function matchFieldByNameAuto(fieldName, useData = Report_Data) {
        let fieldRegex = generateRegexFromString(fieldName);
        return matchFieldByName(fieldRegex, useData);
    }
    
    // create an object with the key name and the matching field values
    // uses the matchFieldByName function
    function nameToObject(keyObj, data = Report_Data) {
        let newObj = {};
        for (const key in keyObj) {
            let keyData = keyObj[key];
            keyMatch = matchFieldByName(keyData, data);
            newObj[key] = keyMatch;
        }
        return newObj;
    }
    
    
    // intakes an object with key name and regex pairs,
    // returns a new object with the key name and the matching field values
    function mergeData(keyObj, data) {
        let mergedData = [];
        let newObj = {};
    
        for (const key in keyObj) {
            mergedData.push(getMatchingFields(keyObj[key], key, newObj));
        }
    
        return newObj;
    }

    // takes in an object and returns a filtered array of objects containing the specified key(s)
    function reduceObj(obj, requiredKey) {
        let filteredObj = [];
        for (const key in obj) {
            if (obj[key][requiredKey]) {
                filteredObj.push(obj[key]);
            }
        }
        return filteredObj;
    }
    
    
    // convenience function that merges the data and reduces the object
    function mergeAndReduce(keyObj, requiredKey, data) {
        return reduceObj(mergeData(keyObj, data), requiredKey);
    }
    
    
    // convenience function that merges the data and reduces the object
    // uses the convertToRegex function for more flexible matching
    function mergeAndReduceAuto(keyObj, requiredKey, data) {
        return reduceObj(mergeData(convertObjectValuesToRegex(keyObj), data), requiredKey);
    }
    
    
    // Merge Data for each section of the document...
    
    
    // Section 0 - Signs of mold
    var Signs_Of_Mold = nameToObjectAuto({
        'person_on_sight': "Name of the person on site",
        'location': "Rooms with an od[oe]r",
        'odor_type': "What Kind of Odor?",
        'odor_present': "Is there an odor?",
        'air_sample': "Air Sample taken"
    });
    Signs_Of_Mold.location = Signs_Of_Mold.location.filter((itm) => itm).join(', ');
    
    // Section 1 - Visual Assessment
    var Visual_Assessment = mergeData(
        {
            'room': /Visual Assessment: Room \d+/i,
            'location': /Visual Assessment: Location in room \d+/i,
            'color': /Visual Assessment: Color of mold in room \d+/i,
            'test': /Visual Assessment: Test taken in room \d+/i,
        },
        'room'
    );
    // var Visual_Assessment = mergeAndReduceAuto(
    //     {
    //         'room': 'Visual Assessment: Room',
    //         'location': 'Visual Assessment: Location in room',
    //         'color': 'Visual Assessment: Color of mold in room 3',
    //         'test': 'Visual Assessment: Test taken in room',
    //     },
    //     // 'room'
    // );
    
    
    // Section 2 - Damage
    var Mold_Damage_Data = mergeAndReduce(
        {
            'room': /Damage: Room (\d+)/i,
            'location': /Damage: Location in room (\d+)/i,
            'damage': /Damage: Damage in room (\d+)/i,
            'type': /Damage: Type of damage in room (\d+)/i,
        },
        'room'
    )
    
    
    // Section 3 - Infrared Imaging
    
    var Images_Infrared = mergeAndReduce(
        {
            'image': /Infrared Imaging (\d+)/i,
            'description': /Infrared Image description (\d+)/i,
        },
        'image'
    ).map((e, i) => {
        //  get the image url
        Img_Url = e.image[0]['url'];
        // use image-kit CDN to make it smaller
        Img_Url = (Img_Url || '').replace(Tadabase_Content_Base, Kit_Half_Page_Base)
    
        // get the image name
        Image_Name = e.name || `Image ${i + 1}`;
    
        return {
            'url': Img_Url,
            'title': Image_Name,
            'description': e.description
        }
    })


    // Section 4 - Observations and Images
    
    var Observations_And_Images = mergeAndReduce(
        {
            'image': /Observations and Images? (\d+)/i,
            'description': /Observations and Images? description (\d+)/i,
        },
        'image'
    ).map((e, i) => {
        let Img_Url, Image_Name;
    
        //  get the image url
        Img_Url = e.image[0]['url'];
        // use image-kit CDN to make it smaller
        Img_Url = (Img_Url || '').replace(Tadabase_Content_Base, Kit_Half_Page_Base);
    
        // get the image name
        Image_Name = e.name || `Image ${i + 1}`;
    
        return {
            'url': Img_Url,
            'title': Image_Name,
            'description': e.description
        }
    })
    
    
    // Section 5 - Moisture
    var Moisture_Concerns = nameToObjectAuto(
        {
            'type': 'Moisture type',
            'room_name': 'Which room has moisture concerns?',
            'location_in_the_room': 'Where in the room are the moisture concerns?',
            'specific_area': 'Specific Area of Source',
            // Source of moisture concern resulting in mold growth
            'source': 'Source of Moisture',
            'cause': 'Due to:',
            'previous': 'Previous Occurrence of Mold',
            'repaired': 'Damage was repaired'
        }
    );
    
    
    
    // Section 6 [Does not exist in the data-table or the report template]
    
    
    // Section 7 - Remediation
    var Remediation_Outline = nameToObjectAuto(
        {
            'process_outline': 'The outline for remediation includes',  // long text - goes where, first bullet point?
            'locations': 'Filtering and/or fumigation of:',  // list
            'throughout': 'Air filtration throughout'  // list?
        }
    );
    Remediation_Outline.locations = Remediation_Outline.locations.filter(e => e);
    
    
    // Section 8 - Treatment
    var Treatment_Process = nameToObject(
        {
            // // Treatment process choices
            // 'steps': 'Treatment process',
            // Dehumidifier should be kept running throughout the
            'dehumidifier': 'Dehumidifier should be',
            // Treatment process text 1
            'decontaminate': 'Treatment process text 1',
            'thoroughly': 'Treatment process text 2',
        },
        keepNumbers = true
    );
    
    // fill in the blanks

    // // replace the placeholders in the steps with the actual values
    // for (const step in Treatment_Process.steps) {
    //     if (step.includes('decontaminate')) {
    //         step.replace(/_*/g, Treatment_Process.decontaminate);
    //     }
    //     if (step.includes('thoroughly')) {
    //         step.replace(/_*/g, Treatment_Process.thoroughly);
    //     }
    // }
    
    // Section 9 - Sampling
    var Sampling_Data = mergeAndReduce(
        {
            'room': /Sampling: Room (\d+)/i,
            'lab_result': /Sampling: Lab results for room (\d+)/i,
            'mold_type': /Sampling: Mold types in room (\d+)/i,
            'other_mold': /Sampling: Sampling: Other types of mold in room (\d+)/i,
        },
        'room'
    ).map(e => {
        let Mold_Types = e.mold_type;
    
        if (Mold_Types) {
            Mold_Types = Mold_Types.join(', ');
        } else {
            Mold_Types = '';
        }
    
        return {
            ...e,
            'mold_type': Mold_Types
        }
    })
    
    
    // Report Info
    var Report_Info = nameToObjectAuto(
        {
            'date': 'Report Date',
            'cover_page_image': 'Cover Photo'
        }
    );
    Report_Info.cover_page_image = (Report_Info.cover_page_image.url || '').replace(Tadabase_Content_Base, Kit_Cover_Base);
    
    // Client Information
    Client_Info = {
        'name': Client_Data.field_43,
        'address': Client_Address,
        'location': Client_Location,
        'phone_number': Client_Data.field_46,
    }
    
    // Merge data into a single object
    var Merged_Data = {
        report: Report_Info,                        // Report Information
        client: Client_Info,                        // Client Information
    
        // Numbered Sections (0-9)
        signs_of_mold: Signs_Of_Mold,                       // Section #0
        visual_assessment: Visual_Assessment,               // Section #1
        mold_damage_data: Mold_Damage_Data,                 // Section #2
        images_infrared: Images_Infrared,                   // Section #3
        observations_and_images: Observations_And_Images,   // Section #4
        moisture_concerns: Moisture_Concerns,               // Section #5
        remediation_outline: Remediation_Outline,           // Section #6
        treatment_process: Treatment_Process,               // Section #7
        sampling_data: Sampling_Data,                       // Section #8
    };
    
    // compute MD5 hash of the data
    var hash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, JSON.stringify(Merged_Data));
    Hash_Merged_Data = '';
    // var Hash_Merged_Data = "";
    for (var i = 0; i < hash.length && i < 4; i++) {
        var byte = hash[i];
        if (byte < 0) {
            byte += 256;
        }
        if (byte.toString(16).length == 1) {
            Hash_Merged_Data += '0';
        }
        Hash_Merged_Data += byte.toString(16);
    }
    
    
    // finish the timer for the merge data process
    var Merge_and_Fetch_Time = new Date().getTime() - Merge_and_Fetch_Start;
    
    var Is_Data_Changed = false;
    var PDF_Generated = false;
    var PDF_Error = false;
    
    if (Hash_Merged_Data != Report_Data.field_178) {
        Is_Data_Changed = true;
    }
    
    
    var Pdf_Generator_Duration = "0";
    
    // // generate the PDF if the data has changed, or if '{generatePDF}' is set to 'True'
    // if (Generate_PDF == 'True' || Is_Data_Changed) {
    // only generate the PDF if Generate_PDF is set to 'True'
    if (Generate_PDF == 'True') {
        // TO-DO: Update the record to say PDF is in progress
    
        // URL for the PDF API (Cloud Layer)
        var PDF_Api_Url = 'https://api.cloudlayer.io/v2/template/pdf';
        // Parameters for the PDF API (Cloud Layer)
        var Request_Var_Cloud_Layer = {
            'method': 'POST',
            'headers': {
                "Content-Type": "application/json", 
                "x-api-key": Cloud_Layer_API_Key
            },
            'payload': JSON.stringify({
                "templateId": Cloud_Layer_Template_ID,
                "format": Report_Page_Size,
                "async": false,
                "delay": 2_000,
                "waitForFrameNavigation": true,
                "waitForFrameImages": true,
                "data": Merged_Data
            }),
            'muteHttpExceptions': true
        };
    
        // time the PDF generation
        var start = new Date().getTime();
    
        // Call The PDF Generation Endpoint (Cloud Layer)
        var PDF_Fetch_Response = UrlFetchApp.fetch(PDF_Api_Url, Request_Var_Cloud_Layer);
        // var PDF_URL = JSON.parse(PDF_Fetch_Response).assetUrl || JSON.parse(PDF_Fetch_Response);
        var PDF_URL = JSON.parse(PDF_Fetch_Response).assetUrl || '';
    
        // calculate the duration of the PDF generation process
        var end = new Date().getTime();
        var Pdf_Generator_Duration = end - start;
    
        // determine if the PDF generation was successful
        if (PDF_Fetch_Response.getResponseCode() != 200) {
            PDF_Error = true;
        }
    
        // mark that the PDF was generated
        PDF_Generated = true;
    };
    
    // Default values for the update record timer
    var Update_Record_Time = "0";
    
    // Update tadabase record with PDF generation progress
    if (PDF_Generated) {
        // Data to update in the record
        if (PDF_Error) {
            Request_Payload = { 'field_177': 'Error' };
        } else {
            Request_Payload = {
                'field_180': PDF_URL,
                'field_177': 'Success',
                'field_178': Hash_Merged_Data
            };
        }
    
        // start the timer for the update record process
        var Update_Record_Start = new Date().getTime();
    
        // Call the tadabase API
        UrlFetchApp.fetch(`${Tadabase_Api_Url}/${Table_Id}/records/${Record_ID}`, {
            'headers': {
                ...Request_Var_Tada.headers,
                // 'X-Tadabase-Queue-Equation': 1
            },
            ...Request_Var_Tada,
            'payload': JSON.stringify(Request_Payload),
            'muteHttpExceptions': (Generate_PDF == 'True')
        });
    
        // finish the timer for the update record process
        var Update_Record_Time = new Date().getTime() - Update_Record_Start;
    }



    
    // Data that gets sent back to the pipe (tadabase)
    return_data = {
        'record_id': Record_ID,
        'table_id': Table_Id,
        // results: {
            'generate_pdf': Generate_PDF,
            'pdf_url': PDF_URL || JSON.parse(PDF_Fetch_Response || '{}'),
            // 'pdf_api_url': PDF_Api_Url,
            'merge_and_fetch_time': Merge_and_Fetch_Time,
            'pdf_generation_time': Pdf_Generator_Duration,
        'post_results_time': Update_Record_Time,
        'data_hash': Hash_Merged_Data,
        'pdf_generated': PDF_Generated,
        'pdf_error': PDF_Error,
        // debug for new merge process
        // 'new_merge': Report_Info,
        'merged_data': Merged_Data,
        // 'focus': Treatment_Process,
        'focus': Visual_Assessment,
    }
    return_data;
}
