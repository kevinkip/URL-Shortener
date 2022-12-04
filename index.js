require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Accessing dns module
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb+srv://Callhimkev:waffles84@mongodb-01.3lbywli.mongodb.net/Website-URL?retryWrites=true&w=majority', {
  useNewUrlParser:true,
  useUnifiedTopology:true,

  }
);

//get default connection
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

const Schema = mongoose.Schema;

const urlSchema = new Schema({
  original_url: String,
  short_url: Number
});

let Person = mongoose.model("Person", urlSchema);


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urlencodedParser = bodyParser.urlencoded({
  extended: false
})
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

const isValidUrl = tester => {
  var urlPattern = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/); // validate fragment locator
return !!urlPattern.test(tester);
}

app.post("/api/shorturl", urlencodedParser, async (req, res) => {

  const originalUrl = req.body.url;
  const urlTest = isValidUrl(originalUrl);

  if (urlTest) {
    var shortUrl = Math.floor(Math.random() * 100000).toString();
    const sameUrl = req.body.url;
    var urlObj = ({
      original_url: sameUrl,
        short_url: shortUrl
      });
  const personUrl = await new Person({
    original_url: sameUrl,
    short_url: shortUrl
  });

  await personUrl.save();
      res.json(urlObj);
  } else {
    res.json({
      error: 'invalid url'
    })
  }
  console.log(urlObj);

  console.log(shortUrl);

})

const collections = Object.keys(mongoose.connection.collections);


// const sample = Person.findOne({ short_url: '66775'});

// var id = '638b705593c9f871dedee535';
// Person.findById(id, function(err, docs) {
//   if(err){
//     console.log(err);
//   } else {
//     console.log("Result: ",docs);
//   }
// });

app.get("/api/shorturl/:id", urlencodedParser, (req,res) => {
  const query = { 'short_url' : req.params.id };
  const queryNum = req.params.id;
  console.log(query);
  console.log(queryNum);

const obj = Person.find({short_url:req.params.id}).select({original_url:1, _id:0 }).exec(function(err, docs) {
  if(err){
    console.log(err);
  } else {
    console.log("Result: ",docs);
    const revised = docs[0];
    const nextRevised = revised.original_url;
    res.redirect(nextRevised);
  }

  console.log(docs);

  console.log(docs[0]);

});

});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
