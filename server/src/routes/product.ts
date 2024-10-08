import { Router } from "express";
import { deleteTask, deleteTaskImage, getLatest, getListings, getTaskDetail, getTasksByCategory, listNewTask, updateTask } from "src/controllers/product";
import { isAuth } from "src/middleware/auth";
import fileParser from "src/middleware/fileParser";
import validate from "src/middleware/validator";
import { newProductSchema } from "src/utils/validationSchema";

const productRouter = Router();

productRouter.post('/create-task', isAuth, fileParser, validate(newProductSchema), listNewTask);
productRouter.patch('/:id', isAuth, fileParser, validate(newProductSchema), updateTask);
productRouter.delete('/:id', isAuth, fileParser, deleteTask);
productRouter.delete('/image/:taskId/:imageId', isAuth, deleteTaskImage);
productRouter.get('/detail/:id', getTaskDetail)
productRouter.get('/by-category/:category', getTasksByCategory)
productRouter.get('/latest', getLatest)
productRouter.get('/listings', isAuth, getListings)

export default productRouter;