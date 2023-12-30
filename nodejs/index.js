const express = require('express');
const moment = require('moment/moment');
//  const bodyParser = require('body-parser');
const app = express();
const port = 6002;
const db = require('./db');
const cors = require('cors');
app.use(cors());

app.use(express.json());


require("./routes")(app)
app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
})

// app.get('/save', async (req, res) => {
//   try {
    
//     const result1 = await db.query('SELECT short_link FROM links WHERE is_active = true');
//     const savedlinks = result1.rows.map(row => row.short_link);
//     console.log({ savedlinks });
//     res.json({savedlinks});
    
//   } catch (error) {
//     console.error('Error fetching short links from the database', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


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


// app.get('/lastsave', async (req, res) => {
//   try {
//     const result = await db.query(
//       'SELECT short_link FROM links WHERE is_active = true ORDER BY id DESC LIMIT 1'
//     );

//     if (result.rows.length === 0) {
//       // No matching record found
//       return res.status(404).json({ error: 'No short links found' });
//     }

//     const lastSavedLink = result.rows[0].short_link;
//     console.log({ lastSavedLink });
//     res.json({ lastSavedLink });
//   } catch (error) {
//     console.error('Error executing query:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// app.post('/update', async (req, res) => {
//   try {
//     const { link } = req.body;
//     await db.query('UPDATE links SET Save =true WHERE link = $1', [link]);
//     res.json({ save: true });
//   } catch (error) {
//     console.error('Error updating isSaved status:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.get('/saved', async (req, res) => {
  try {
    const result = await db.query('SELECT short_link, link, tags, title, description FROM links WHERE is_active = TRUE');
    
    const savedLinks = result.rows.map(({ short_link, link, tags, title, description }) => ({
      short_link,
      link,
      tags,
      title,
      description,
    }));

    res.json({ savedLinks });
  } catch (error) {
    console.error('Error fetching saved links:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// app.post('/name', async (req, res) => {
//   const { name } = req.body;

//   console.log('Received data:', { name });

//   try {
//     const result = await db.query(
//       'INSERT INTO links (name, save) VALUES ($1, true) RETURNING *',
//       [name]
//     );

//     console.log('Inserted into database:', result.rows[0]);
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error storing name in the database', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });









  