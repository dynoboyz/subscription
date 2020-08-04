const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();
app.use(bodyparser.json()); // Configuring express server

// MySQL connection
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'ezypay',
    password: 'ezypay',
    database: 'ezypay',
    multipleStatements: true
});
mysqlConnection.connect((err)=> {
    if(!err)
        console.log('Connection Established Successfully');
    else
        console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
});

// Establish the server connection
const port = 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

// GET subscription data from Database
app.get('/subscription' , (req, res) => {
    mysqlConnection.query('SELECT * FROM subscription', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

// POST Insert new subscription
app.post('/subscription', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    let subs = req.body;
    var sql = "INSERT INTO subscription (amount, type, day, start_dt, end_dt) VALUES (?, ?, ?, ?, ?)";

    const dateformat = require('dateformat');
    var start_dt = new Date(subs.start_dt);
    var max_dt = new Date(subs.start_dt);
    var end_dt = new Date(subs.end_dt);

    // max duration 3 months
    max_dt.setMonth(max_dt.getMonth() + 3); 
    if (end_dt.getTime() > max_dt.getTime()) {
        res.send({status: 'error', message: 'Maximum duration only 3 months. Update your End Date max to ' + dateformat(max_dt, 'yyyy-mm-dd')});
    } else if (end_dt.getTime() <= start_dt.getTime()) {
        res.send({status: 'error', message: 'End Date must be greater than Start Date.'+end_dt.getTime()+'##'+start_dt.getTime()});
    } else {
        mysqlConnection.query(sql, [subs.amount, subs.type, subs.day, subs.start_dt, subs.end_dt], (err, rows, fields) => {
            if (!err) {
                Date.prototype.getWeek = function() {
                    var dt = new Date(this.getFullYear(),0,1);
                    return Math.ceil((((this - dt) / 86400000) + dt.getDay()+1)/7);
                };
        
                var invoice_dt = [];
                switch(subs.type) {
                    case 2: // weekly
                        var min_week = start_dt.getWeek(); // start from 0 - 6 (monday - sunday)
                        var max_week = end_dt.getWeek();
                        var wnew_dt = new Date(start_dt.getFullYear()+'-'+(start_dt.getMonth()+1)+'-'+subs.day);
                        for (var w = min_week; w <= max_week; w++) {
                            invoice_dt.push(dateformat(wnew_dt, 'dd/mm/yyyy'));
                            wnew_dt = new Date(wnew_dt.getTime() + (60*60*24*7*1000)); // + 7 days
                        }
                        break;
                    case 3: // monthly
                        var min_month = start_dt.getMonth() + 1; // getMonth() start from 0
                        var max_month = end_dt.getMonth() + 1;
                        for (var m = min_month; m <= max_month; m++) {
                            // m + 1 if day is before start date
                            invoice_dt.push(subs.day+'/'+m+'/'+start_dt.getFullYear());
                        }
                        break;
                    default: // 1 -daily
                        var dnew_dt = new Date(start_dt);
                        var timeDiff = (new Date(end_dt)) - (new Date(start_dt));
                        var days = timeDiff / (1000 * 60 * 60 * 24)
                        for (var d = 0; d <= days; d++) {
                            invoice_dt.push(dateformat(dnew_dt, 'dd/mm/yyyy'));
                            dnew_dt.setDate(dnew_dt.getDate() + 1); // + 1 day
                        }
                        break;
                }
                res.send({status: 'success', amount: subs.amount, type: subs.type, invoice_dt: invoice_dt, message: 'New Subscription successfully.'});
            } else
                res.send({status: 'error', message: 'New Subscription failed: ' + err});
        })
    }
});