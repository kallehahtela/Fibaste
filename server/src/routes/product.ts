import { Router } from "express";
import { deleteTask, deleteTaskImage, getTaskDetail, getTasksByCategory, listNewTask, updateTask } from "src/controllers/product";
import { isAuth } from "src/middleware/auth";
import fileParser from "src/middleware/fileParser";
import validate from "src/middleware/validator";
import { newProductSchema } from "src/utils/validationSchema";

const productRouter = Router();

productRouter.post('/create-task', isAuth, fileParser, validate(newProductSchema), listNewTask);
productRouter.patch('/:id', isAuth, fileParser, validate(newProductSchema), updateTask);
productRouter.delete('/:id', isAuth, fileParser, deleteTask);
productRouter.delete('/image/:taskId/:imageId', isAuth, deleteTaskImage);
productRouter.get('/:id', getTaskDetail)
productRouter.get('/by-category/:category', getTasksByCategory)

export default productRouter;