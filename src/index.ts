
import  express  from "express";
import cors from "cors";
import { userRouter } from "./routes/userRouter";
import { postRouter } from "./routes/postRouter";
import { limiter } from "./utils/rate-limiter";
import { collageRouter } from "./routes/collageRouter";
import { AuthMiddleware } from "./middleware/AuthMiddleware";
import { EventRouter } from "./routes/eventRouter";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors())
app.use("/api/v1/user" , limiter);
app.use("/api/v1/post" , AuthMiddleware);
app.use("api/v1/college", AuthMiddleware);


app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/events", EventRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

