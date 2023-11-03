const mongoose = require('mongoose');

const connectDb= async()=>{
    try{
      const resultado=  await mongoose.connect(process.env.MONGO_URL)
      console.log(`se conecto la base de dato:'${resultado.connection.host}`)

    } catch(erro){
        console.log(erro)
    }
}


module.exports=connectDb