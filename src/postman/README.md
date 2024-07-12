# Setting up the mock server

- Download and install Postman
- Import collection.json under the collection tab
- Set the following environment variables:
    - *base_url*: https://api.fennellabs.com
    - *username*: your fennellabs username
    - *password*: your fennellabs password
    - *token*: create but leave blank
- Send the "login" request at least once before trying the mock server, ensure the token variable is set after
- Create a new mock server using the collection, it should give you a url that looks like: https://a60d7402-3c0a-45af-9d21-266e9299bdeb.mock.pstmn.io
- Replace the baseUrl in src/congif.json with the mock server url

