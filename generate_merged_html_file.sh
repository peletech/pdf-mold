#!/bin/bash

# # Recommended to run this script via:
# ls paged*.css pagedjs.html *.py gen*html*.sh sample*.json nunjucks*.js generate_pdf.js | entr sh generate_merged_html_file.sh

# make sure the script is run from the correct directory
cd /home/em/Documents/pdf_mold/


# echo that the file was created with the time
echo "./generate_merged_html_file.sh at $(date)"
echo "Input File: ./pagedjs.html"
sleep 0.5


# This script creates a template_file.html file based on the merge_html.py script
rm template_file.html
python3 merge_html.py >> template_file.html
echo "Merged: ./template_file.html [$(date)] (via ./merge_html.py)"
sleep 0.5


# render the template_file.html template file into a rendered HTML file
deno run --allow-read --allow-write nunjucks_render.js
echo "Merged: ./template_rendered.html [$(date)] (via ./nunjucks_render.js)"
sleep 0.5

# # render the template_file.html file into a pdf using phantomjs
# phantomjs render.js template_file.html template_html.pdf

# render the template_rendered.html file into a pdf using puppeteer
node generate_pdf.js ./template_rendered.html ./template_rendered.pdf
# node generate_pdf.js template_file.html template_rendered.pdf
# # render to /tmp/ then copy over to the current directory
# # (otherwise it triggers several writes in the current directory)
# node generate_pdf.js './template_rendered.html' '/tmp/template_rendered.pdf'
# mv /tmp/template_rendered.pdf .
# echo PDF File: "./template_rendered.pdf [$(date)] (via ./generate_pdf.js)"
# # node generate_pdf.js


echo

# echo Upload HTML Template
# deno run --allow-read --allow-net --allow-write update_template_CL.js

echo 