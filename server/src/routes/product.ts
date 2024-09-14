import { Router } from "express";
import { listNewTask, updateProduct } from "src/controllers/product";
import { isAuth } from "src/middleware/auth";
import fileParser from "src/middleware/fileParser";
import validate from "src/middleware/validator";
import { newProductSchema } from "src/utils/validationSchema";

const productRouter = Router();

productRouter.post('/create-task', isAuth, fileParser, validate(newProductSchema), listNewTask);
productRouter.patch('/:id', isAuth, fileParser, validate(newProductSchema), updateProduct);

export default productRouter;