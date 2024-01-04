const express = require('express');
const moment = require('moment/moment');
//  const bodyParser = require('body-parser');
const app = express();
const port = 6002;
const db = require('./db');
const cors = require('cors');
const cheerio = require('cheerio');
const axios = require('axios');
app.use(cors());

app.use(express.json());


require("./routes")(app)
app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
})




app.get('/u/:shortLink', async (req, res) => {
  const { shortLink } = req.params;

  try {
    const result = await db.query('SELECT link FROM links WHERE short_link = $1 AND is_active = true', [shortLink]);
    if (result.rows.length > 0) {
      res.redirect(result.rows[0].link);
    } else {
      res.status(404).json({ error: 'URL not found' });
    }
    console.log("shortlink",shortLink)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/url', async (req, res) => {
  const { link, short_link, title, tags, description } = req.body;

  console.log('Received data:', { link, short_link, title, tags, description });

  try {
    const result = await db.query(
      'INSERT INTO links (link, short_link, title, tags, description, is_active) VALUES ($1, $2, $3, $4, $5, TRUE) RETURNING *',
      [link, short_link, title, tags, description]
    );

    console.log('Inserted into database:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error storing URL in the database', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.get('/saved', async (req, res) => {
  try {
    const result = await db.query('SELECT short_link, link, tags, title, description, is_active FROM links');
    
    const allLinks = result.rows.map(({ short_link, link, tags, title, description, is_active }) => ({
      short_link,
      link,
      tags,
      title,
      description,
      is_active,
    }));

    res.json({ allLinks });
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/check-link-exists', async (req, res) => {
  const { link } = req.body;

  try {
    const result = await db.query('SELECT * FROM links WHERE link = $1 AND is_active = true', [link]);

    if (result.rows.length > 0) {
      // Link already exists in the database
      res.json({ exists: true, linkData: result.rows[0] });
    } else {
      // Link does not exist in the database
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking link existence in the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/extract-info', async (req, res) => {
  const { link } = req.body;

  try {
    const response = await axios.get(link);
    const html = response.data;
    const $ = cheerio.load(html);

    const title = $('head title').text();
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';

    res.json({ title, description });
  } catch (error) {
    console.error('Error extracting information from the link:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/edit/:shortLink', async (req, res) => {
  const { shortLink } = req.params;
  const { title, tags } = req.body;

  try {
    // Check if the short link exists in the database
    const linkResult = await db.query('SELECT * FROM links WHERE short_link = $1 AND is_active = true', [shortLink]);

    if (linkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Short link not found' });
    }

    // Update title and tags in the database
    const updateResult = await db.query(
      'UPDATE links SET title = $1, tags = $2 WHERE short_link = $3 AND is_active = true RETURNING *',
      [title, tags, shortLink]
    );

    const updatedLink = updateResult.rows[0];
    res.json(updatedLink);
  } catch (error) {
    console.error('Error updating title and tags:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/deactivate/:shortLink', async (req, res) => {
  const { shortLink } = req.params;

  try {
    // Check if the short link exists in the database
    const linkResult = await db.query('SELECT * FROM links WHERE short_link = $1', [shortLink]);

    if (linkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Short link not found' });
    }

    // Update is_active to false in the database
    const updateResult = await db.query(
      'UPDATE links SET is_active = false WHERE short_link = $1 RETURNING *',
      [shortLink]
    );

    const updatedLink = updateResult.rows[0];
    res.json(updatedLink);
  } catch (error) {
    console.error('Error updating is_active status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Add this route after your existing routes
app.put('/activate/:shortLink', async (req, res) => {
  const { shortLink } = req.params;

  try {
    // Check if the short link exists in the database
    const linkResult = await db.query('SELECT * FROM links WHERE short_link = $1', [shortLink]);

    if (linkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Short link not found' });
    }

    // Update is_active to true in the database
    const updateResult = await db.query(
      'UPDATE links SET is_active = true WHERE short_link = $1 RETURNING *',
      [shortLink]
    );

    const updatedLink = updateResult.rows[0];
    res.json(updatedLink);
  } catch (error) {
    console.error('Error updating is_active status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
