const express = require('express');
const Staff = require('../models/staff');

const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
  try {
    const staffs = await Staff.find();
    res.json(staffs);
  } catch (error) {
    res.json({ message: error });
  }
});

router.get('/:staffId', async (req, res) => {
  try {
    const user =
      typeof req.body.user != 'undefined' ? req.body.user : undefined;
    if (req.params.staffId !== user._id || user.role !== 'administrator')
      res.status(403).send({ message: 'Not authorized!' });
    const queriedStaff = await Staff.findById(req.params.staffId);
    res.json(queriedStaff);
  } catch (error) {
    res.json({ message: error });
  }
});

router.post('/', async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;
    const role =
      typeof req.body.role == 'string' && req.body.role.length > 0
        ? req.body.role
        : undefined;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send({ message: 'All input is required' });
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await Staff.findOne({ email });

    if (oldUser) {
      return res
        .status(409)
        .send({ message: 'User Already Exist. Please Login' });
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await Staff.create({
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      role: role,
    });

    // return new user
    res.status(201).json({ ...user._doc });
  } catch (err) {
    console.log(err);
  }
});

router.delete('/:staffId', async (req, res) => {
  const user = typeof req.body.user != 'undefined' ? req.body.user : undefined;
  if (req.params.staffId !== user._id || user.role !== 'administrator')
    res.status(403).send({ message: 'Not authorized!' });
  try {
    const deletedStaff = await Staff.deleteOne({ _id: req.params.staffId });
    res.json(deletedStaff);
  } catch (error) {
    res.json({ message: error });
  }
});

router.patch('/:staffId', async (req, res) => {
  const user = typeof req.body.user != 'undefined' ? req.body.user : undefined;
  if (req.params.staffId !== user._id || user.role !== 'administrator')
    res.status(403).send({ message: 'Not authorized!' });
  try {
    const updatedStaff = await Staff.updateOne(
      { _id: req.params.staffId },
      { $set: req.body }
    );
    res.json(updatedStaff);
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
