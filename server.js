const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MLAB_URI;
console.log(uri)
mongoose.connect(uri, 
  { useNewUrlParser: true, 
    useCreateIndex: true }, 
    function(error){
      if (error) {
        console.log(error);
      } else {
        console.log("Connected to MLAB mongodb")
      }
    }
);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const router = require('./routes/router');

app.use('/', router);

app.listen(port, () => {
    console.log("Server is running on port: " + port);
    console.log("mLab URL = " + uri)
});
