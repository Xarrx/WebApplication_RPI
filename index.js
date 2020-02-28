const express = require('express');
const axios = require('axios');
const api = require('./src/api');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// route for testing
app.get('/', (req, res) => {
  axios({
    method: 'get',
    url: 'https://webapplicationrpi--dkendz.repl.co/api',
    data: [
      {
        alias: 'red_pin',
        operation: 'write',
        value: 0
      }
    ]
  }).then((result) => {
    //console.log(result.data);
    res.status(200).json(result.data);
  }).catch((e) => {
    console.log('Error: '+e.response.data.message);
  });

});

app.get('/api', api);

app.listen(3000, () => {
  console.log('server started');
});