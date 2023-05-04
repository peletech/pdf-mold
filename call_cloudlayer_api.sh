# curl requests for CloudLayer API
# testing the PDF generate API, etc

# curl --request GET \
#   --url https://api.cloudlayer.io/v2/getStatus \
#   --header 'x-api-key: cl-d43fa111c39f42c2a3344dc281b35081'

# echo
# echo

# curl --request GET \
#   --url https://api.cloudlayer.io/v2/account \
#   --header 'x-api-key: cl-d43fa111c39f42c2a3344dc281b35081'

# echo
# echo


# curl --request POST \
#   --url https://api.cloudlayer.io/v2/template/pdf \
#   --header 'Content-Type: application/json' \
#   --header 'x-api-key: cl-d43fa111c39f42c2a3344dc281b35081' \
#   --data '{
# 	"templateId": "u-five-boro-mold",
# 	"async": false,
#   "waitForFrameNavigation": true,
# 	"data": {
# 		"clientName": "test joe",
#     "reportDate": "Today is the day"
# 	}
# }'
# # echo
# # echo


curl --request POST \
  --url https://api.cloudlayer.io/v2/template/pdf \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: cl-26d99b31c59740a692444a2484c06046' \
  --data '{
    "templateId": "u-mold-report",
    "async": false,
    "waitForFrameNavigation": true
  }'