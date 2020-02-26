var express = require('express');
var api = require('./src/js/api');
//var $ = require('jQuery');
var axios = require('axios');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// route for testing
app.get('/', (req, res) => {
  axios({
    method: 'get',
    url: 'https://webapplicationrpi--dkendz.repl.co/api',
    data: {
      action: 'getColor'
    }
  }).then((result) => {
    console.log(result.data);
    res.status(200).json(result.data);
  }).catch((e) => {
    console.log(e.response.data.message);
  });

});

app.get('/api', (req, res) => {
  //console.log(req);
  api.get_handler(req, res);
});

app.listen(3000, () => {
  console.log('server started');
});