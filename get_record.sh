# Various curl requests for fetching and updating data using the official TadaBase API's


# Get a specific record (report):
curl \
    -X 'GET' 'https://api.tadabase.io/api/v1/data-tables/K2ejlOQo9B/records/W0VNq8rmlK' \
    -H 'x-tadabase-app-id: YZjnq9mQPv' \
    -H 'x-tadabase-app-key: biyiNNR4Qwch' \
    -H 'x-tadabase-app-secret: B2ktYuclnwuBqbtRsKV7S4XIEAEJt3Wm'


# Get a specific record (client):
curl \
    -X 'GET' 'https://api.tadabase.io/api/v1/data-tables/eykNOvrDY3/records/3GDN1mNeqP' \
    -H 'x-tadabase-app-id: YZjnq9mQPv' \
    -H 'x-tadabase-app-key: biyiNNR4Qwch' \
    -H 'x-tadabase-app-secret: B2ktYuclnwuBqbtRsKV7S4XIEAEJt3Wm'


# Get the fields data for a specific data table:
echo Fields Data:
curl \
    -X 'GET' 'https://api.tadabase.io/api/v1/data-tables/K2ejlOQo9B/fields' \
    -H 'x-tadabase-app-id: YZjnq9mQPv' \
    -H 'x-tadabase-app-key: biyiNNR4Qwch' \
    -H 'x-tadabase-app-secret: B2ktYuclnwuBqbtRsKV7S4XIEAEJt3Wm'


# Params for old app
    # -H 'x-tadabase-app-key: PQSAn4dkXI6p' \
    # -H 'x-tadabase-app-secret: hBPKBsEq6HmKjnw9va0pATD09NWKusGf' \
    # -H 'x-tadabase-app-id: Z9Q2gMmj2m'
