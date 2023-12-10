import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"; // contains paths and routes of all kind of authentication features
import userRoutes from "./routes/users.js"; // contains paths and routes of all kind of user features
import postRoutes from "./routes/users.js"; // contains paths and routes of all kind of post functions
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet()); //middleware for securing Express.js applications by setting various HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common")); // middleware for logging HTTP requests in an Express.js application
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors()); //CORS is a security feature implemented by web browsers to restrict web pages from making requests to a different domain than the one that served the original web page
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/*Register  :  Routes with file*/

app.post(
  "/auth/register",
  upload.single("picture"),
  register
); /*ideally this declaration should also be included in the ./routes/auth.js file , but only for register section where profile picture needs to be uploaded , we need to keep it here only , as we need to use "upload" function*/

app.post("/posts", verifyToken, upload.single("picture"), createPost);
/*Routes*/
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/*MONGOOSE SETUP*/
const PORT = process.env.PORT || 6001; // By default take port number from '.env' file , if that port doesn't work take port 6001

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Port ${PORT}`);
    });

    /* Insert data only once */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((Error) => {
    console.log(`${Error} did not connect`);
  });
