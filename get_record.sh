# Various curl requests for fetching and updating data using the official TadaBase API's




# # Table_ID:K2ejlOQo9B
# # Record_ID:lGArg57QmR

# # App ID: Z9Q2gMmj2m
# # API Key: PQSAn4dkXI6p
# # API Secret: hBPKBsEq6HmKjnw9va0pATD09NWKusGf


# # Get a specific Record:
# curl \
#     -X 'GET' 'https://api.tadabase.io/api/v1/data-tables/K2ejlOQo9B/records/W0VNq8rmlK' \
#     -H 'x-tadabase-app-key: PQSAn4dkXI6p' \
#     -H 'x-tadabase-app-secret: hBPKBsEq6HmKjnw9va0pATD09NWKusGf' \
#     -H 'x-tadabase-app-id: Z9Q2gMmj2m'


# # # Get the fields data for a specific data table:
# # curl \
# #     -X 'GET' 'https://api.tadabase.io/api/v1/data-tables/K2ejlOQo9B/fields' \
# #     -H 'x-tadabase-app-key: PQSAn4dkXI6p' \
# #     -H 'x-tadabase-app-secret: hBPKBsEq6HmKjnw9va0pATD09NWKusGf' \
# #     -H 'x-tadabase-app-id: Z9Q2gMmj2m'

# # # echo.
# # # echo.
# # # echo.




# new record
curl \
    -X 'GET' 'https://build.tadabase.io/api/v1/objects/Z9Q2gMmj2m/get/objects' \
    -H 'x-tadabase-app-id: YZjnq9mQPv'
    -H 'x-tadabase-app-key: biyiNNR4Qwch' \
    -H 'x-tadabase-app-secret: B2ktYuclnwuBqbtRsKV7S4XIEAEJt3Wm' \

# echo.
# echo.
# echo.


# # curl \
# #     -X 'GET' 'https://api.tadabase.io/api/v1/data-tables/eykNOvrDY3/records/6b1rAKQKkA' \
# #     -H 'x-tadabase-app-key: PQSAn4dkXI6p' \
# #     -H 'x-tadabase-app-secret: hBPKBsEq6HmKjnw9va0pATD09NWKusGf' \
# #     -H 'x-tadabase-app-id: Z9Q2gMmj2m'

# # {"type":"success","item":{"id":"6b1rAKQKkA","field_43":"Gabi","field_45":"gbondi121@gmail.com","field_46":"1111111111","field_47":-4,"field_48":"2334556678","field_85":"Active","field_176":"","field_173":{"address":"54 Sunny Road","address2":"","city":"Johannesburg","state":"Gauteng","country":"South Africa","zip":"2192","lng":"28.1061642","lat":"-26.1384167"}}}