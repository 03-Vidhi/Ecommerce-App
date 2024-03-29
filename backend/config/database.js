import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `connection with mongodb successfully done ${conn.connection.host}`
        .bgMagenta.white
    );
  } catch (error) {
    console.log(`Error in connecting the mongodb ${error}`.bgRed.white);
  }
};
export default connectDB;
