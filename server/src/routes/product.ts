import { Router } from "express";
import { listNewTask } from "src/controllers/product";
import { isAuth } from "src/middleware/auth";
import fileParser from "src/middleware/fileParser";
import validate from "src/middleware/validator";
import { newProductSchema } from "src/utils/validationSchema";

const productRouter = Router();

productRouter.post('/create-task', isAuth, fileParser, validate(newProductSchema), listNewTask);

export default productRouter;