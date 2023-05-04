# PDF Template'r and generator for Five Boro Mold Corporation

Code to generate the template, merge files, update the code on tadabase, etc.

---

## What works:
- Rendering and merging a template locally
- Uploading, running, and retrieving pipes from tada
- Dynamically retrieving data for _most_ of the form values
- etc, etc


## What's broken:
- Visual Assessment data (`tada.js`, section #1)
- Treatment Process data (`tada.js`, section #8)
    - Fill in the blanks feature



---

## Useful Commands and URL's:

Commands:
- `deno run --allow-read --allow-net run_pipe.js False oGWN5eqNlA`

URL's:
- https://build.tadabase.io/apps/manage/YZjnq9mQPv

- https://app.cloudlayer.io/editor?id=Srh1NZcJmx4HeBuspkfQ



---

## Explanation of included Files


Template source file
- `pagedjs.html` - Template source file
- `pagedjs.css` - Main CSS file of template

- `paged_interface.css` - CSS file to preview paged.js layout in browser

- `pdf-000.png` - Company Logo
- `pdf-002.png` - Company Banner


Actual code that gets run on TadaBase to render the template
- `tada_js.js`


Updating, fetching, and testing the template with CloudLayer
- `CL_Template_Request.json`
- `CL_get_template.js`
- `CL_token.js`
- `CL_token.json`


Dev-ops tools & scripts for tadabase
- `run_pipe.js` - Test/run the the "pipe" and return its output
- `update_pipe.js`- Update the code/contents of the "pipe"
- `read_pipe_data.js` - Read the last version code/contents from the "pipe"
- `get_record.sh` - Curl commands to get (and update) records and field data from TadaBase

- `fetch_tada.js`
- `get_cookie.js`

- `pipe_body.json`
- `run_pipe_request.json`

- `tada_fields.json`
- `tadabase_record.json`

Update/upload template to CloudLayer
- `update_template_CL.js`


Utilities
- `generate_merged_html_file.sh` (merges/generates the template and renders it)


Generating and rendering the template
- generate_pdf.js
- merge_html.py
- nunjucks_render.js


Node.js Stuff
- `package.json` (for Puppeteer)


Other
- `pdf-003.png` - Sample cover image
- `pdf.html` - Source PDF file converted to HTML
- `pdf.txt` - Full text contents of the source (old) PDF file

- `test_data.json` - Sample JSON showing the desired shape of the form data
- `sample_merged_data.json` - Merged JSON of the form data (from tadabase)


Standard
- `.gitignore`
- `README.md`


---

© Elliot Gerchak & Dovid Gefen (PeleTech), 2023