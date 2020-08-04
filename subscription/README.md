## API Script

// API set up
### npm init

// Web framework, converting the POST data into the request body
### npm i --s express express-handlebars mongoose body-parser

// Nodejs driver for MySQL
### npm i --mysql

// Automatically restarting the server whenever the code changes (global)
### npm i -g nodemon

// API Run
### nodemon script.js

## Sample Request
method: POST
url: http://localhost:8080/subscription
body (json):
{
    "amount": 200,
    "type": 2,
    "day": 3,
    "start_dt": "2020-08-05",
    "end_dt": "2020-09-01"
}

## Sample Response
body (json):
{
    "status": "success",
    "amount": 200,
    "type": 2,
    "invoice_dt": [
        "03/08/2020",
        "10/08/2020",
        "17/08/2020",
        "24/08/2020",
        "31/08/2020"
    ],
    "message": "New Subscription successfully."
}
