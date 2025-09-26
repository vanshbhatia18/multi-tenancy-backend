import app from "./app.js"
import connectDB from "./database/index.js"
import dotenv from "dotenv";

dotenv.config({ path: "./env" });

connectDB()
  .then(() => {
    if (!process.env.VERCEL) {
      const PORT = process.env.PORT || 8000;
      app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
      });
    
    }  })
  .catch((error) => {
    console.log("Mongo_Db connection failed", error);
  });

  

