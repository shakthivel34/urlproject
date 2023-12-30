const db=require('../db');

exports.url=async(req,res)=>{
    const result= await db.query('SELECT * FROM links');
    res.json(result.rows);
}


  
//   app.listen(port, () => {
//     console.log(`API is running at http://localhost:${port}`);
//   });