require('dotenv').config();
const express = require('express');
const router = express.Router();
//const multer = require('multer');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');
const Journal = require('../models/Journal');

// =========== Image Upload Configuration =============
//multer config
// const storage = multer.diskStorage({
//   filename: function (req, file, callback) {
//     callback(null, Date.now() + file.originalname);
//   },
// });
// const imageFilter = (req, file, cb) => {
//   // accept image files only
//   if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
//     return cb(new Error('Only image files are allowed!'), false);
//   }
//   cb(null, true);
// };
// const upload = multer({ storage: storage, fileFilter: imageFilter });

//@route get journals
//@desc get curr user's all journals
//@access private

router.get('/mine', auth, async (req, res) => {
  try {
    const journals = await Journal.find({
      author: req.user.id,
    })
      .sort({ date: -1 })
      .populate('author', ['username', 'avatar']);
    res.json(journals);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

//@route get /:id
//@desc get journal by id
//@access public
router.get('/:id', async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id).populate('author', [
      'username',
    ]);

    if (!journal) {
      return res.status(404).json({ msg: 'Journal not found' });
    }
    res.json(journal);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Journal not found' });
    }
    console.log(err);
    res.status(500).send('Server error');
  }
});

//@route get /user/:user_id/public_journals
//@desc get specific user's all public journals
//@access public
router.get('/:user_id/public_journals', async (req, res) => {
  try {
    const profile = await Profile.findOne({ owner: req.params.user_id });
    const journals =
      profile.allPrivate === 'true'
        ? []
        : await Journal.find({ author: req.params.user_id })
            .where('setPrivate')
            .equals('false')
            .sort({ date: -1 });

    res.json(journals);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

//@route post /journal
//@desc create a new journal
//@access private
router.post(
  '/',
  [
    auth,
    [check('content', 'You better write something').not().isEmpty()],
    [check('title', 'Give it a title name').not().isEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({
        owner: req.user.id,
      });
      const newJournal = new Journal({
        title: req.body.title,
        content: req.body.content,
        author: req.user.id,
        image: req.body.image,
        setPrivate:
          profile !== null && profile.allPrivate === 'true'
            ? 'true'
            : req.body.setPrivate,
      });

      const journal = await newJournal.save();
      if (profile !== null) {
        profile.journals.push(journal);
        await profile.save();
      }
      res.json(journal);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  }
);

//@route delete /:id
//@desc delete a journal
//@access private

router.delete('/:id', auth, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    const profile = await Profile.findOne({
      owner: req.user.id,
    });
    if (!journal) {
      return res.status(404).json({ msg: 'Journal not found' });
    }
    if (journal.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await journal.remove();
    if (profile !== null) {
      profile.journals.pop(journal);
      await profile.save();
    }
    res.json({ msg: 'Journal removed' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Journal not found' });
    }
    res.status(500).send('Server error');
  }
});

//@route post /:id
//@desc update a journal
//@access private
router.put(
  '/:id',
  [
    auth,
    [
      [check('content', 'You better write something').not().isEmpty()],
      [check('title', 'Give it a title name').not().isEmpty()],
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const journal = await Journal.findById(req.params.id);
      const profile = await Profile.findOne({
        owner: req.user.id,
      });
      if (!journal) {
        return res.status(404).json({ msg: 'Journal not found' });
      }
      if (journal.author.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
      if (profile !== null) {
        profile.journals.pop(journal);
      }
      journal.author = req.user.id;
      journal.title = req.body.title;
      journal.content = req.body.content;
      journal.setPrivate =
        profile !== null && profile.allPrivate === 'true'
          ? 'true'
          : req.body.setPrivate;

      await journal.save();
      if (profile !== null) {
        profile.journals.push(journal);
        await profile.save();
      }

      res.json(journal);
    } catch (err) {
      console.log(err);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Journal not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

//@route get /journals
//@desc get all public journals
//@access public
router.get('/', async (req, res) => {
  try {
    const journals = await Journal.find()
      .where('setPrivate')
      .equals('false')
      .sort({ date: -1 })
      .populate('author', ['username', 'avatar']);
    res.json(journals);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

//@route    PUT journals/like/:id
//@desc     Like a journal
//@access   Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    //check if the post has already been liked
    if (
      journal.likes.filter((like) => like.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: 'Journal already liked' });
    }

    journal.likes.unshift({ user: req.user.id });

    await journal.save();
    res.json(journal.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@route    PUT journals/unlike/:id
//@desc     Unlike a journal
//@access   Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    //check if the journal has already been liked
    if (
      journal.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Journal has not yet been liked' });
    }
    //Get remove index
    const removedIndex = journal.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    journal.likes.splice(removedIndex, 1);

    await journal.save();
    res.json(journal.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
