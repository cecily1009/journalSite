require('dotenv').config();
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');
const Journal = require('../models/Journal');

//@route get journals
//@desc get curr user's all journals
//@access private

router.get('/mine', auth, async (req, res) => {
  try {
    const journals = await Journal.find({
      author: req.user.id,
    })
      .sort({ created: 'desc'})
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
      'avatar',
    ]);
    if (!journal) {
      return res.status(404).json({ msg: 'Journal not found' });
    }

    res.json(journal);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Journal not found' });
    }
    
    res.status(500).send('Server error');
  }
});

//@route get /user/:user_id/public_journals
//@desc get specific user's all public journals
//@access public
router.get('/:user_id/public_journals', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      owner: req.params.user_id,
    });
    const journals =
      profile.allPrivate === 'true'
        ? []
        : await Journal.find({ author: req.params.user_id })
            .where('setPrivate')
            .equals('false')
            .sort({ created: -1 })
            .populate('author', ['avatar']);

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
        image: req.body.image !== '' ? req.body.image : Journal.image,
        setPrivate:
          profile !== null && profile.allPrivate === 'true'
            ? 'true'
            : req.body.setPrivate !== ''
            ? req.body.setPrivate
            : Journal.setPrivate,
      });
      const journal = await newJournal.save();
      if (profile !== null) {
        profile.journals.push(journal._id);
        await profile.save();
      }
      res.json(journal);
    } catch (err) {
      
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
    // delete the journal from profile's journal list
    if (profile !== null) {
      profile.journals.filter((journal_id)=>journal_id!==journal._id);
      await profile.save();
    }
    //send alert message
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
      const update_journal = await Journal.findById(req.params.id);
      const profile = await Profile.findOne({
        owner: req.user.id,
      });
      if (!update_journal) {
        return res.status(404).json({ msg: 'Journal not found' });
      }
      if (update_journal.author.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
      
      update_journal.author = req.user.id;
      update_journal.title = req.body.title;
      update_journal.content = req.body.content;

      // if upload image locally, set journal image; otherwise using default image 

      (update_journal.image = req.body.image !== '' ? req.body.image : update_journal.image),

      /**
       * If user enabled "one-key to set all journals be private", 
       * journal should always be private even if user tries to set the journal to be public.
       * **/
      
        (update_journal.setPrivate =
          profile !== null && profile.allPrivate === 'true'
            ? 'true'
            : req.body.setPrivate !== ''
            ? req.body.setPrivate
            : update_journal.setPrivate),

          
        await update_journal.save();
      res.json(update_journal);
    } catch (err) {
     
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
      .sort({ created: -1 })
      .populate('author', ['username', 'avatar']);
    res.json(journals);
  } catch (err) {
    
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
      return res.status(400).json({ msg: 'Journal already be liked' });
    }

    journal.likes.unshift({ user: req.user.id });

    await journal.save();
    res.json(journal.likes);
  } catch (err) {
    
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
    
    res.status(500).send('Server error');
  }
});

module.exports = router;









