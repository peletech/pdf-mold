// Extract the address from the client data and merge it into a single string
var Client_Address_JSON = Client_Data.field_173; // {"address":"54 Sunny Road","address2":"","city":"Johannesburg","state":"Gauteng","country":"South Africa","zip":"2192","lng":"28.1061642","lat":"-26.1384167"}
var Client_Address = (Client_Address_JSON || {'address': ''}).address;
var Client_Location = `${(Client_Address_JSON || { 'city': '' }).city}, ${(Client_Address_JSON || { 'state': '' }).state} ${(Client_Address_JSON || {'zip': ''}).zip}`;



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
    // Create an empty array to store matching fields
    let matchingFields = [];
    // Iterate over the keys in the Table_Fields object
    for (const Table_Field in Table_Fields) {
        // Check if the name property of the field matches the provided regex
        let match = (Table_Fields[Table_Field].name || '').match(fieldRegex);
        // If the field matches the regex, create a new object with the corresponding value from useData
        // and the index found in the regex match, and add it to the matchingFields array
        if (match) {
            matchingFields.push({
                [newKey]: useData[Table_Fields[Table_Field].slug],
                'index': match[1]
            });
            // Update the indexToUpdate object with the data from the matching fields
            indexToUpdate[match[1]] = indexToUpdate[match[1]] || {};
            indexToUpdate[match[1]][newKey] = useData[Table_Fields[Table_Field].slug];
        }
    }
    // Return the array of matching fields
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
    if (!keepNumbers) {
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
        let match = (item.name || '').match(fieldRegex);
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
        let keyMatch = matchFieldByName(keyData, data);
        newObj[key] = keyMatch;
    }
    return newObj;
}


// intakes an object with key name and regex pairs,
// returns a new object with the key name and the matching field values
function mergeData(keyObj) {
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
Signs_Of_Mold.location = (Signs_Of_Mold.location || []).filter((itm) => itm).join(', ');


// Section 1 - Visual Assessment

var Visual_Assessment = mergeAndReduce(
    {
        // 'room': 'Visual Assessment'
        'room': /Visual Assessment: Room (\d+)/i,
        'location': /Visual Assessment: Location in room (\d+)/i,
        'color': /Visual Assessment: Color of mold in room (\d+)/i,
        'test': /Visual Assessment: Test taken in room (\d+)/i,
    },
    'room'
);


// Section 2 - Damage
var Mold_Damage_Data = mergeAndReduce(
    {
        'room': /Damage: Room (\d+)/i,
        'location': /Damage: Location in room (\d+)/i,
        'damage': /Damage: Damage in room (\d+)/i,
        'type': /Damage: Type of damage in room (\d+)/i,
    },
    'room'
);


// Section 3 - Infrared Imaging

var Images_Infrared = mergeAndReduce(
    {
        'image': /Infrared Imaging (\d+)/i,
        'description': /Infrared Image description (\d+)/i,
    },
    'image'
).map((e, i) => {
    //  get the image url
    let Img_Url = e.image[0]['url'];
    // use image-kit CDN to make it smaller
    Img_Url = (Img_Url || '').replace(Tadabase_Content_Base, Kit_Half_Page_Base)

    // get the image name
    let Image_Name = e.name || `Image ${i + 1}`;

    return {
        'url': Img_Url,
        'title': Image_Name,
        'description': e.description
    }
});


// Section 4 - Observations and Images

var Observations_And_Images = mergeAndReduce(
    {
        'image': /Observations? and Images? (\d+)/i,
        'description': /Observations? and Images? description (\d+)/i,
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
});


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
Remediation_Outline.locations = (Remediation_Outline.locations || []).filter(e => e);


// Section 8 - Treatment
var Treatment_Process = nameToObject(
    {
        // Treatment process choices
        'steps_1': 'Treatment process choices 1',
        'steps_2': 'Treatment process choices 2',
        'steps_3': 'Treatment process choices 3',
        // Dehumidifier should be kept running throughout the
        'dehumidifier': 'Dehumidifier should be',
        // Treatment process text 1
        'decontaminate': /Treatment process text 1/i,
        'thoroughly': /Treatment process text 2/i,
    },
    // // keepNumbers
    // true
);

Treatment_Process.steps = [
    ...Treatment_Process.steps_1,
    ...Treatment_Process.steps_2,
    ...Treatment_Process.steps_3
];

delete Treatment_Process.steps_1;
delete Treatment_Process.steps_2;
delete Treatment_Process.steps_3;

// fill in the blanks

let steps = Treatment_Process.steps;


// replace the placeholders in the steps with the actual values
for (let stepIndex in steps) {
    // get the step text
    let step = steps[stepIndex];

    // remove the bullet point
    step = step.replace(/•(  )?/, '');

    // replace the underlined part
    if (step.startsWith('_') && step.includes('decontaminate')) {
        console.log('decontaminate:', step);
        step = step.replace(/_*/, Treatment_Process.decontaminate);
    }
    if (step.startsWith('_') && step.includes('thoroughly')) {
        console.log('thoroughly:', step);
        step = step.replace(/_*/, Treatment_Process.thoroughly);
    }

    // remove extra spaces
    step = step.replace(/^\s+/, '');

    // update the step
    steps[stepIndex] = step;
}

// de-dup steps
steps = [...new Set(steps)];

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
});


// Report Info
var Report_Info = nameToObjectAuto(
    {
        'date': 'Report Date',
        'cover_page_image': 'Cover Photo'
    }
);
Report_Info.cover_page_image = ((Report_Info.cover_page_image || {'url': ''}).url).replace(Tadabase_Content_Base, Kit_Cover_Base);

// Client Information
var Client_Info = {
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