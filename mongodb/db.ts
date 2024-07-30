import mongoose from "mongoose";
const connectionString="mongodb://localhost:27017";

if(!connectionString){
    throw new Error("please provide a valid connection string");
}

export const connectDB= async ()=>{
    if(mongoose.connection?.readyState>=1){
        // The database is already connected
        return;
    }

    try{
        //connecting to the mongodb database
        await mongoose.connect(connectionString);
    }catch(error){
        console.log("Error connecting to the databse", error);
    }
};