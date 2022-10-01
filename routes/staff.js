const express = require('express');
const Staff = require('../models/staff');

const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
  try {
    const staffs = await Staff.find();
    res.json(staffs);
  } catch (error) {
    res.json({ error });
  }
});

router.get('/:staffId', async (req, res) => {
  try {
    const user =
      typeof req.body.user != 'undefined' ? req.body.user : undefined;
    if (req.params.staffId !== user._id || user.role !== 'administrator')
      res.status(403).send({ error: 'Not authorized!' });
    const queriedStaff = await Staff.findById(req.params.staffId);
    res.json(queriedStaff);
  } catch (error) {
    res.json({ error });
  }
});

router.post('/', async (req, res) => {
  try {
    // Get user input
    const { email, password, role } = req.body;

    // Validate user input
    if (!(email && password && role)) {
      res.status(400).send({ error: 'All input is required' });
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await Staff.findOne({ email });

    if (oldUser) {
      return res
        .status(409)
        .send({ error: 'User Already Exist. Please Login' });
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await Staff.create({
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      role,
    });

    // return new user
    res.status(201).json({ ...user._doc });
  } catch (err) {
    console.log(err);
  }
});

router.delete('/:staffId', async (req, res) => {
  const user = typeof req.body.user != 'undefined' ? req.body.user : undefined;
  if (user.role !== 'administrator')
    res.status(403).send({ error: 'Not authorized!' });
  try {
    const deletedStaff = await Staff.deleteOne({ _id: req.params.staffId });
    res.json(deletedStaff);
  } catch (error) {
    res.json({ error });
  }
});

router.patch('/:staffId', async (req, res) => {
  const editor =
    typeof req.body.user != 'undefined' ? req.body.user : undefined;

  if (editor.role !== 'administrator') {
    res.status(403).send({ error: 'Not authorized!' });
  } else {
    try {
      const { email, password, role } = req.body;

      // Validate user input
      if (!(email && password && role)) {
        res.status(400).send({ error: 'All input is required' });
      }

      //Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10);

      const updatedStaff = await Staff.updateOne(
        { _id: req.params.staffId },
        { $set: { email, password: encryptedPassword, role } }
      );

      res.json(updatedStaff);
    } catch (error) {
      res.json({ error, some: 'klshflgsdflskdf' });
    }
  }
});

module.exports = router;
