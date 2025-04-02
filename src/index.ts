
import  express  from "express";
import cors from "cors";
import Auth from "./middleware/AuthMiddleware";
import { userRouter } from "./routes/userRouter";
import { postRouter } from "./routes/postRouter";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors())

app.use("api/v1/user", userRouter)
app.use("api/v1/post", postRouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
