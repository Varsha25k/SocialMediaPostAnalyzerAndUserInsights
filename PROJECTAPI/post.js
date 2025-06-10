const express = require('express');
const router = express.Router();
const Pool = require('./db'); // your PostgreSQL pool setup

// Validation helpers
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
const isValidDate = (date) => !isNaN(Date.parse(date));
const isPositiveInteger = (num) => Number.isInteger(num) && num > 0;
const isNonEmptyString = (str) => typeof str === 'string' && str.trim() !== '';

// POST /authors
router.post('/authors', async (req, res) => {
  const { authorname, email } = req.body;

  if (!isNonEmptyString(authorname) || !isValidEmail(email)) {
    return res.status(400).json({ error: "authorname and valid email are required" });
  }

  try {
    const result = await Pool.query(
      'INSERT INTO Authors (authorname, email) VALUES ($1, $2) RETURNING *',
      [authorname, email]
    );
    res.status(201).json({ message: "Author added", author: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /posts
router.post('/posts', async (req, res) => {
  const { author_id, content, post_date } = req.body;

  if (!isPositiveInteger(author_id) || !isNonEmptyString(content)) {
    return res.status(400).json({ error: "Valid author_id and content are required" });
  }
  // post_date is optional; if provided, validate it
  if (post_date && !isValidDate(post_date)) {
    return res.status(400).json({ error: "Invalid post_date" });
  }

  try {
    const result = await Pool.query(
      'INSERT INTO posts (author_id, content, post_date) VALUES ($1, $2, COALESCE($3, CURRENT_TIMESTAMP)) RETURNING *',
      [author_id, content, post_date]
    );
    res.status(201).json({ message: "Post added", post: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /comments
router.post('/comments', async (req, res) => {
  const { post_id, author_id, comment_text, comment_date } = req.body;

  if (!isPositiveInteger(post_id) || !isPositiveInteger(author_id) || !isNonEmptyString(comment_text)) {
    return res.status(400).json({ error: "Valid post_id, author_id, and comment_text are required" });
  }
  if (comment_date && !isValidDate(comment_date)) {
    return res.status(400).json({ error: "Invalid comment_date" });
  }

  try {
    const result = await Pool.query(
      'INSERT INTO comments (post_id, author_id, comment_text, comment_date) VALUES ($1, $2, $3, COALESCE($4, CURRENT_TIMESTAMP)) RETURNING *',
      [post_id, author_id, comment_text, comment_date]
    );
    res.status(201).json({ message: "Comment added", comment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /likes
router.post('/likes', async (req, res) => {
  const { post_id, author_id, like_date } = req.body;

  if (!isPositiveInteger(post_id) || !isPositiveInteger(author_id)) {
    return res.status(400).json({ error: "Valid post_id and author_id are required" });
  }
  if (like_date && !isValidDate(like_date)) {
    return res.status(400).json({ error: "Invalid like_date" });
  }

  try {
    const result = await Pool.query(
      'INSERT INTO likes (post_id, author_id, like_date) VALUES ($1, $2, COALESCE($3, CURRENT_TIMESTAMP)) RETURNING *',
      [post_id, author_id, like_date]
    );
    res.status(201).json({ message: "Like added", like: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /shares
router.post('/shares', async (req, res) => {
  const { post_id, author_id, share_date } = req.body;

  if (!isPositiveInteger(post_id) || !isPositiveInteger(author_id)) {
    return res.status(400).json({ error: "Valid post_id and author_id are required" });
  }
  if (share_date && !isValidDate(share_date)) {
    return res.status(400).json({ error: "Invalid share_date" });
  }

  try {
    const result = await Pool.query(
      'INSERT INTO shares (post_id, author_id, share_date) VALUES ($1, $2, COALESCE($3, CURRENT_TIMESTAMP)) RETURNING *',
      [post_id, author_id, share_date]
    );
    res.status(201).json({ message: "Share added", share: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /hashtags
router.post('/hashtags', async (req, res) => {
  const { tag_name } = req.body;

  if (!isNonEmptyString(tag_name)) {
    return res.status(400).json({ error: "tag_name is required" });
  }

  try {
    const result = await Pool.query(
      'INSERT INTO hashtags (tag_name) VALUES ($1) RETURNING *',
      [tag_name]
    );
    res.status(201).json({ message: "Hashtag added", hashtag: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /post_hashtags
router.post('/post_hashtags', async (req, res) => {
  const { post_id, hashtag_id } = req.body;

  if (!isPositiveInteger(post_id) || !isPositiveInteger(hashtag_id)) {
    return res.status(400).json({ error: "Valid post_id and hashtag_id are required" });
  }

  try {
    const result = await Pool.query(
      'INSERT INTO post_hashtags (post_id, hashtag_id) VALUES ($1, $2) RETURNING *',
      [post_id, hashtag_id]
    );
    res.status(201).json({ message: "Post-Hashtag link added", post_hashtag: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /reactions
router.post('/reactions', async (req, res) => {
  const { reaction_type } = req.body;

  if (!isNonEmptyString(reaction_type)) {
    return res.status(400).json({ error: "reaction_type is required" });
  }

  try {
    const result = await Pool.query(
      'INSERT INTO reactions (reaction_type) VALUES ($1) RETURNING *',
      [reaction_type]
    );
    res.status(201).json({ message: "Reaction added", reaction: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /post_reactions
router.post('/post_reactions', async (req, res) => {
  const { post_id, reaction_id, author_id, react_date } = req.body;

  if (!isPositiveInteger(post_id) || !isPositiveInteger(reaction_id) || !isPositiveInteger(author_id)) {
    return res.status(400).json({ error: "Valid post_id, reaction_id, and author_id are required" });
  }
  if (react_date && !isValidDate(react_date)) {
    return res.status(400).json({ error: "Invalid react_date" });
  }

  try {
    const result = await Pool.query(
      'INSERT INTO post_reactions (post_id, reaction_id, author_id, react_date) VALUES ($1, $2, $3, COALESCE($4, CURRENT_TIMESTAMP)) RETURNING *',
      [post_id, reaction_id, author_id, react_date]
    );
    res.status(201).json({ message: "Post Reaction added", post_reaction: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /user_activity
router.post('/user_activity', async (req, res) => {
  const { author_id, activity_type, activity_time } = req.body;

  if (!isPositiveInteger(author_id) || !isNonEmptyString(activity_type)) {
    return res.status(400).json({ error: "Valid author_id and activity_type are required" });
  }
  if (activity_time && !isValidDate(activity_time)) {
    return res.status(400).json({ error: "Invalid activity_time" });
  }

  try {
    const result = await Pool.query(
      'INSERT INTO user_activity (author_id, activity_type, activity_time) VALUES ($1, $2, COALESCE($3, CURRENT_TIMESTAMP)) RETURNING *',
      [author_id, activity_type, activity_time]
    );
    res.status(201).json({ message: "User Activity added", user_activity: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
