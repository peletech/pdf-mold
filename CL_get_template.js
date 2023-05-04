// This script is able to fetch the latest (uploaded) version of the template from CloudLayer's backend
// (Template ID & toekn are outdated and must be updated)

const request = await fetch(
    "https://api.cloudlayer.io/user/templates/535xxJJ9hAjBP1h1sswr", {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,he;q=0.7",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOTczZWUwZTE2ZjdlZWY0ZjkyMWQ1MGRjNjFkNzBiMmVmZWZjMTkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcHJvZC1jbG91ZGxheWVyaW8iLCJhdWQiOiJwcm9kLWNsb3VkbGF5ZXJpbyIsImF1dGhfdGltZSI6MTY3NjI1NDY5NCwidXNlcl9pZCI6IlJBTFYwYjBFdWNPNEh5RUxtOWJzUVBYVzhZcDEiLCJzdWIiOiJSQUxWMGIwRXVjTzRIeUVMbTlic1FQWFc4WXAxIiwiaWF0IjoxNjc5MjU0MzgxLCJleHAiOjE2NzkyNTc5ODEsImVtYWlsIjoiZW1nZXJjaGFrK2NsZGx5cnRhZGFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImVtZ2VyY2hhaytjbGRseXJ0YWRhQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.XhyVq8cbDA4qmFfnmbo3g8xODDQvuk_fd9tFwDOre3M9ynNZ3lIstt9EmD4ckvZBnXQp5-0CK80oAVlNj-EnK2P6onFNbzFRL6yDA8bLBA29no70Z08ZBxS3qUVBgZt1LUbzSBT6D0sqtxjy8CjjvVBVe889AJaSBZ0B1VxCjf6bFqToPeaqxCN85CBMToZ2hVbmelP114-jLVT_JpQ9MO9p9uI7In7UCr2VKGdkoqAUj4jhqngxzsuz_nAcEEJgTzFGqT98wTvPUX1imXMIM0KgYmab25lYGjt0rgBxDSo7-pBKsA-jS2pk7un_6Qaq2beaWTHyNpufw6F-E6S1_A",
        "Referer": "https://app.cloudlayer.io/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
});

const data = await request.json();
console.log(data);