require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Profile = require('../models/Profile');
const Journal = require('../models/Journal');
const auth = require('../middleware/auth');

//@route get profile/me
//@desc get user's profile
//@access private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      owner: req.user.id,
    }).populate('owner', ['username', '_id', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.status(500).send('Server error');
  }
});

//@route GET api/profile/:user_id
//@desc Get specific user's profile by user_id
//@access Public

router.get('/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      owner: req.params.user_id,
    }).populate('owner', ['username', '_id', 'avatar']);
    res.json(profile);
  } catch (err) {
    
    if (err.kind == 'ObjectId') {
      return res
        .status(400)
        .json({ msg: 'There is no profile for this user.' });
    } else res.status(500).send('server error');
  }
});

//@route POST api/profile
//@desc Create /update user profile
//@access Private
router.post('/', auth, async (req, res) => {
  const { bio, allPrivate, status } = req.body;
  //Build profile object
  const profileFields = {
    owner: req.user.id,
    bio,
    allPrivate,
    status,
  };

  try {
    // Using upsert option (creates new doc if no match is found):
    let profile = await Profile.findOneAndUpdate(
      { owner: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true }
    );
    // one-key to set all journals be private
    if (profile.allPrivate === 'true') {
      profile.journals.forEach(async (journal_id) => {
        const journal = await Journal.findById(journal_id);
        journal.setPrivate = true;
        await journal.save();
      });
    } 

    res.json(profile);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

//@route DELETE /profile
//@desc DELETE user, profile & journals
//@access Private

router.delete('/', auth, async (req, res) => {
  try {
    //remove user's posts
    await Journal.deleteMany({ author: req.user.id });
    //remove profile

    await Profile.findOneAndRemove({ owner: req.user.id });

    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    
    res.status(500).send('Server Error');
  }
});

module.exports = router;
