import mongoose from "mongoose";

export const dbConnection = () =>{
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "SIMPLE_HMS"
    })
    .then(()=>{
        console.log("Connected to database")
    })
    .catch((err)=>{
        console.log('Some errors occur while connecting to database', err)
    })
}