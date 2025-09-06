import mongoose from "mongoose";

export function dbconnection(){
    mongoose.connect(process.env.DB_CONNECTION_Offline).then(()=>{
        console.log("DB connection Sucssfuly");
    }).catch(()=>{
        console.log("DB connection not done");

    })
}

