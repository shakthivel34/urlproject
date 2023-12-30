const db = require('./db');

module.exports=app=>{
    const urlq=require('./query/urlq');
    console.log("test");

    app.get("/url",urlq.url);

   
      
}