const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/',async(req,res)=>{
    try{
        res.json('WELCOME TO SOCIAL MEDIA POST ANALYZER API');
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/authors',async(req,res)=>{
    try{
        const result = await pool.query('Select * from authors');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/posts',async(req,res)=>{
    try{
        const result = await pool.query('Select * from posts');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/likes',async(req,res)=>{
    try{
        const result = await pool.query('Select * from likes');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/comments',async(req,res)=>{
    try{
        const result = await pool.query('Select * from comments');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/shares',async(req,res)=>{
    try{
        const result = await pool.query('Select * from shares');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/hashtags',async(req,res)=>{
    try{
        const result = await pool.query('Select * from hashtags');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/post_hashtags',async(req,res)=>{
    try{
        const result = await pool.query('Select * from post_hashtags');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/reactions',async(req,res)=>{
    try{
        const result = await pool.query('Select * from reactions');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/post_reactions',async(req,res)=>{
    try{
        const result = await pool.query('Select * from post_reactions');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/user_activity',async(req,res)=>{
    try{
        const result = await pool.query('Select * from user_activity');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/gettotalauthors',async(req,res)=>{
    try{
        const result = await pool.query('select count(*) as Total_Authors from authors');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/gettotalposts',async(req,res)=>{
    try{
        const result = await pool.query('select count(*) as Total_posts from posts');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/gettotallikes',async(req,res)=>{
    try{
        const result = await pool.query('select count(*) from likes');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/gettotalshares',async(req,res)=>{
    try{
        const result = await pool.query('select count(*) from shares');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/gettotalcomments',async(req,res)=>{
    try{
        const result = await pool.query('select count(*) from comments');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/gettotalreactions',async(req,res)=>{
    try{
        const result = await pool.query('select count(*) from reactions');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/get-hashtag-usage',async(req,res)=>{
    try{
        const result = await pool.query(`
      SELECT h.tag_name, COUNT(ph.post_id) AS usage_count
      FROM hashtags h
      JOIN post_hashtags ph ON h.hashtag_id = ph.hashtag_id
      GROUP BY h.tag_name
      ORDER BY usage_count DESC
      LIMIT 10
    `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

//Who is most active overall across posts, comments, likes, shares?
app.get('/get-top-active-users',async(req,res)=>{
    try{
        const result = await pool.query(`
      SELECT a.authorname, 
        COUNT(DISTINCT p.post_id) +
        COUNT(DISTINCT c.comment_id) +
        COUNT(DISTINCT l.like_id) +
        COUNT(DISTINCT s.share_id) AS total_activity
      FROM authors a
      LEFT JOIN posts p ON a.author_id = p.author_id
      LEFT JOIN comments c ON a.author_id = c.author_id
      LEFT JOIN likes l ON a.author_id = l.author_id
      LEFT JOIN shares s ON a.author_id = s.author_id
      GROUP BY a.authorname
      ORDER BY total_activity DESC
      LIMIT 5
    `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

//Who creates the most posts?
app.get('/top-authors', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.authorname, COUNT(p.post_id) AS post_count
      FROM authors a
      JOIN posts p ON a.author_id = p.author_id
      GROUP BY a.authorname
      ORDER BY post_count DESC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({Error:err.message});
  }
});


app.get('/get-post-frequency',async(req,res)=>{
    try{
        const result = await pool.query(`
      SELECT DATE(post_date) AS post_date, COUNT(*) AS post_count
      FROM posts
      GROUP BY post_date
      ORDER BY post_date
    `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get("/getPostCountByAuthor", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.authorname AS author, COUNT(p.post_id) AS post_count
      FROM authors a
      LEFT JOIN posts p ON a.author_id = p.author_id
      GROUP BY a.authorname
      ORDER BY post_count DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/getActivityDistribution", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT activity_type, COUNT(*) as count
      FROM user_activity
      GROUP BY activity_type
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/getCommentsByPost", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.post_id AS post_id, COUNT(c.post_id) AS comment_count
      FROM posts p
      LEFT JOIN comments c ON p.post_id = c.post_id
      GROUP BY p.post_id
      ORDER BY comment_count DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/top-reactions", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.reaction_type, COUNT(*) AS count
      FROM post_reactions pr
      JOIN reactions r ON pr.reaction_id = r.reaction_id
      GROUP BY r.reaction_type
      ORDER BY count DESC
      LIMIT 10;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});


app.get("/getPostShares", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT post_id, COUNT(*) AS share_count
      FROM shares
      GROUP BY post_id
      ORDER BY share_count DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/getPostLikes", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT post_id, COUNT(*) AS like_count
      FROM likes
      GROUP BY post_id
      ORDER BY like_count DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

/*daily active users for last 7 days 
 ( WHERE activity_time >= CURRENT_DATE - INTERVAL '7 days' ) 
*/
app.get("/getDailyActiveUsers", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DATE(activity_time) AS activity_date, COUNT(DISTINCT author_id) AS active_users
      FROM user_activity
      GROUP BY activity_date
      ORDER BY activity_date
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/posts-over-time", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(post_date, 'YYYY-MM') AS month,
        COUNT(*) AS post_count
      FROM posts
      GROUP BY month
      ORDER BY month
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching posts over time:", err);
    res.status(500).json({ Error: "Database error" });
  }
});

const postRoutes = require('./post');
app.use('/api', postRoutes);


const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Connected Successfully....Running on PORT ${PORT}`);
});