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
let exit;

if (Report_Data == 0) {
    exit = {
        'error': 'Could not generate report',
        'message': 'No data found. Tadabase record is missing. Contact customer support.',
        'data': Report_Data,
        'request': Get_Report_Data
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

    // end script and return error data
    exit;
} else {
    // get client data and generate structured JSON


    var Client_Record_Id = Report_Data.field_84[0];
    // var Client_Record_Id = matchFieldByNameAuto('Client Name', Report_Data);

    // Fetch the client data record from the data table
    var Clients_Table_ID = 'eykNOvrDY3';
    var Fetch_Response = UrlFetchApp.fetch(`${Tadabase_Api_Url}/${Clients_Table_ID}/records/${Client_Record_Id}`, Request_Var_Tada);
    var Client_Data = JSON.parse(Fetch_Response).item;


    // [Record merge code goes here]
    // ...start (Everything in this section will get replaced)
    var Merged_Data = {
        'Error': 'Data Merge Code is missing! Check source file!'
    };
    // See: './tada_data_merge.js'
    // ...end


    // compute MD5 hash of the data [DevSkim: ignore DS126858]
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
                'field_321': PDF_URL,
                'field_322': 'Success',
                'field_323': Hash_Merged_Data
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
