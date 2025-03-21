const databse = require('mongoose');

function connecttodb(){
    databse.connect(process.env.db_connect).then(()=>{
        console.log('connected to db');
    }
    ).catch(err=>{
        console.log(err);
    }
    )
    }
module.exports = connecttodb;