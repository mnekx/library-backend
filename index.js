require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fileupload = require('express-fileupload');
const cors = require('cors');
const staffRoute = require('./routes/staff');
const booksRoute = require('./routes/books');
const bodyParser = require('body-parser');
const path = require('path')
const User = require('./models/staff')
const auth = require('./middleware/auth');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(
  fileupload({
    createParentPath: true,
  })
);

app.use(cors());
app.use(bodyParser.json())

app.use('/api/staff', auth, staffRoute);
app.use('/api/books', auth, booksRoute);

app.post('/api/register', async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send({ message: 'All input is required' });
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(409)
        .send({ message: 'User Already Exist. Please Login' });
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '60s',
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json({...user._doc, token});
  } catch (err) {
    console.log(err);
  }
});

app.post('/api/login', async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send('All input is required');
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '86400s',
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).send({...user._doc, token});
    } else {
      res.status(400).send({ message: 'Invalid Credentials' });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

mongoose.connect(process.env.MONGO_URI, () => console.log('connected to DB!'));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
