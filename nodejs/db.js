const{dbConnect,Pool}=require('pg')
const db=new Pool({
    user:"postgres",
    host:"127.0.0.1",
    password:"shakthivel",
    port:5432,
    database:"url_shortner"
});

module.exports=db;
