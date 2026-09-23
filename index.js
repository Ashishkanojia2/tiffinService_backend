import { config } from "dotenv";
import { connectDataBase } from "./src/config/database.js";
import { app } from "./src/app.js";

config({ path: "./src/config/config.env" });
connectDataBase();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is Running on port : ", PORT);
});
