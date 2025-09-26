import app from "./app.js"
import connectDB from "./database/index.js"
import dotenv from "dotenv";

dotenv.config({ path: "./env" });

connectDB()
  .then(() => {
    
    app.listen(process.env.PORT, () => {
      console.log(`listning on the port ${process.env.PORT || 8000}`);
    });
    }  )
  .catch((error) => {
    console.log("Mongo_Db connection failed", error);
  });

  

