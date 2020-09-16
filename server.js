require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var app = express();

const path = require('path');

//DATABASE SETUP
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const connection = mongoose.connection;
connection.once('open', function () {
  console.log('MongoDB database connection established successfully');
});

//body parse..
app.use(express.json({ extended: false }));
//app.use(express.urlencoded({extended: true}));

//DEFINE ROUTES
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));
app.use('/journals', require('./routes/journals'));
app.use('/profile', require('./routes/profile'));
// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(process.env.PORT || 5000, () => console.log('Server started...'));
