import { UploadApiResponse } from "cloudinary";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import cloudUploader, { cloudApi } from "src/cloud";
import ProductModel from "src/models/product";
import { UserDocument } from "src/models/user";
import categories from "src/utils/categories";
import { sendErrorRes } from "src/utils/helper";

const uploadImage = (filePath: string): Promise<UploadApiResponse> => {
    return cloudUploader.upload(filePath, {
        width: 1280,
        height: 720,
        crops: 'fill',
    });
};

export const listNewTask: RequestHandler = async (req, res) => {
    // Create Product
    const { name, price, category, description, publishingDate } = req.body;
    const newProduct = new ProductModel({
        owner: req.user.id,
        name,
        price,
        category,
        description,
        publishingDate
    });

    // Validate and Uplaod File (or Files) - note (restrict image qty).
    const { images } = req.files;

    const isMultipleImages = Array.isArray(images);

    if (isMultipleImages && images.length > 3) {
        return sendErrorRes(res, `Image files can't be more than 3!`, 422)
    }

    let invalidFileType = false;

    // if this is the case we have multiple images
    if (isMultipleImages) {
        for (let img of images) {
            if (!img.mimetype?.startsWith('image')) {
                invalidFileType = true;
                break;
            }
        }
    } else {
        if (images) {
            if (!images.mimetype?.startsWith('image')) {
                invalidFileType = true;
            }
        }
    }

    if (invalidFileType) return sendErrorRes(res, 'Invalid file type, files must be image type!', 422);

    // File upload
    if (isMultipleImages) {
        const uploadPromise = images.map((file) => uploadImage(file.filepath));
        // Wait for all file uploads to complete
        const uploadResults = await Promise.all(uploadPromise);
        // Add the image URLs and public IDs to the product's images field
        newProduct.images = uploadResults.map(({ secure_url, public_id }) => {
            return { url: secure_url, id: public_id };
        });
        newProduct.thumbnail = newProduct.images[0].url;
    } else {
        if (images) {
            const { secure_url, public_id } = await uploadImage(images.filepath);
            newProduct.images = [{ url: secure_url, id: public_id }];
            newProduct.thumbnail = secure_url;
        }
    }

    await newProduct.save();

    // And send the response back.
    res.status(201).json({ message: 'Added new task!' });
};

export const updateTask: RequestHandler = async (req, res) => {
    //Validate incoming data.
    const { name, price, category, description, publishingDate, thumbnail } = req.body;
    const taskId = req.params.id;
    if (!isValidObjectId(taskId)) return sendErrorRes(res, 'Invalid task id!', 422);

    // Update normal properties (if the task is made by same user).
    const task = await ProductModel.findOneAndUpdate(
        { _id: taskId, owner: req.user.id },
        {
            name,
            price,
            category,
            description,
            publishingDate,
        },
        {
            new: true,
        }
    );
    if (!task) return sendErrorRes(res, 'Task not found!', 404);

    if (typeof thumbnail === 'string') task.thumbnail = thumbnail;

    // Upload and update images (restrict image qty).
    const { images } = req.files;
    const isMultipleImages = Array.isArray(images);

    const oldImages = task.images?.length || 0;
    if (isMultipleImages) {
        if (oldImages + images.length > 3) {
            return sendErrorRes(res, `Image files can't be more than 3!`, 422)
        }
    }

    if (oldImages >= 3) {
        return sendErrorRes(res, 'Task already has 3 images!', 422);
    }


    let invalidFileType = false;

    // if this is the case we have multiple images
    if (isMultipleImages) {
        for (let img of images) {
            if (!img.mimetype?.startsWith('image')) {
                invalidFileType = true;
                break;
            }
        }
    } else {
        if (images) {
            if (!images.mimetype?.startsWith('image')) {
                invalidFileType = true;
            }
        }
    }

    if (invalidFileType) return sendErrorRes(res, 'Invalid file type, files must be image type!', 422);

    // File upload
    if (isMultipleImages) {
        const uploadPromise = images.map((file) => uploadImage(file.filepath));
        // Wait for all file uploads to complete
        const uploadResults = await Promise.all(uploadPromise);
        // Add the image URLs and public IDs to the product's images field
        const newImages = uploadResults.map(({ secure_url, public_id }) => {
            return { url: secure_url, id: public_id };
        });

        if (task.images) {
            task.images.push(...newImages);
        }
        else {
            task.images = newImages;
        }
    } else {
        if (images) {
            const { secure_url, public_id } = await uploadImage(images.filepath);
            if (task.images) {
                task.images.push({ url: secure_url, id: public_id });
            } else {
                task.images = [{ url: secure_url, id: public_id }];
            }
        }
    }

    await task.save();

    res.status(201).json({ message: 'Task updated successfully.' });
};

export const deleteTask: RequestHandler = async (req, res) => {
    // Validate task id.
    const taskId = req.params.id;
    if (!isValidObjectId(taskId)) {
        return sendErrorRes(res, '', 422)
    }

    // Remove if it is made by same user.
    const task = await ProductModel.findOneAndDelete({ _id: taskId, owner: req.user.id });

    if (!task) {
        return sendErrorRes(res, 'Task not found!', 404);
    }

    // Remove images as well.
    const images = task.images || [];
    if (images.length) {
        const ids = images.map(({ id }) => id);
        await cloudApi.delete_resources(ids);
    }

    // nd send response back.
    res.json({ message: 'Task removed succesfully.' });
};

export const deleteTaskImage: RequestHandler = async (req, res) => {
    // Validate the product id.
    const { taskId, imageId } = req.params;
    if (!isValidObjectId(taskId)) {
        return sendErrorRes(res, 'Invalid task id!', 422);
    }

    // Remove the image from DB (if it is made by the same user).
    const task = await ProductModel.findOneAndUpdate(
        { _id: taskId, owner: req.user.id },
        {
            $pull: {
                images: { id: imageId },
            },
        },
        {
            new: true
        }
    );

    if (!task) {
        return sendErrorRes(res, 'Task not found!', 404);
    }

    // Checking that if we remove the thumbnail we change its value
    if (task.thumbnail?.includes(imageId)) {
        const images = task.images;
        if (images) {
            task.thumbnail = images[0].url;
        } else {
            task.thumbnail = '';
        }
        await task.save();
    }

    // Remove from cloud as well.
    // Removing from cloud storage
    await cloudUploader.destroy(imageId);

    res.json({ message: 'Image removed successfully.' });
};

export const getTaskDetail: RequestHandler = async (req, res) => {
    /*
2. Validate the task id.
3. Find Task by the id.
4. Format data.
5. And send response back.
    */

    // Validate the task id.
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return sendErrorRes(res, 'Invalid task id!', 422);
    }

    // Find Task by the id.
    const task = await ProductModel.findById(id).populate<{ owner: UserDocument }>('owner');
    if (!task) {
        return sendErrorRes(res, 'Task not found!', 404);
    }

    // Format data.
    res.json({
        task: {
            task: task._id,
            name: task.name,
            description: task.description,
            thumbnail: task.thumbnail,
            category: task.category,
            date: task.publishingDate,
            price: task.price,
            images: task.images?.map(({ url }) => url),
            seller: {
                id: task.owner._id,
                name: task.owner.name,
                avatar: task.owner.avatar?.url,
            },
        },
    });
};

export const getTasksByCategory: RequestHandler = async (req, res) => {
    // Validate the category.
    const { category } = req.params;
    const { pageNo = '1', limit = '10' } = req.query as { pageNo: string, limit: string };
    if (!categories.includes(category)) {
        return sendErrorRes(res, 'Invalid category', 422);
    }

    // Find tasks by category (apply pagination if needed).
    const tasks = await ProductModel.find({ category })
        .sort('-createdAt')
        .skip((+pageNo - 1) * +limit)
        .limit(+limit);

    // Format data.
    const listings = tasks.map(t => {
        return {
            id: t._id,
            name: t.name,
            thumbnail: t.thumbnail,
            category: t.category,
            price: t.price,
        }
    });

    //And send response back.
    res.json({ tasks: listings });
};

export const getLatest: RequestHandler = async (req, res) => {
    // Find all the tasks with sorted date (apply limit/pagination if needed).
    const tasks = await ProductModel.find().sort('-createdAt').limit(10);

    // Format data.
    const listings = tasks.map((t) => {
        return {
            id: t._id,
            name: t.name,
            thumbnail: t.thumbnail,
            category: t.category,
            price: t.price,
        };
    });

    // And send the response back.
    res.json({ tasks: listings });
};

export const getListings: RequestHandler = async (req, res) => {
    /*
    1. User must be authenticated.
    2. Find all the products created by this user (apply pagination if needed).
    3. Format data.
    4. And send response back.
    */
    const { pageNo = '1', limit = '10' } = req.query as {
        pageNo: string;
        limit: string;
    };

    const tasks = await ProductModel.find({ owner: req.user.id })
        .sort('-createdAt')
        .skip((+pageNo - 1) * +limit)
        .limit(+limit);

    // Format data.
    const listings = tasks.map((t) => {
        return {
            id: t._id,
            name: t.name,
            thumbnail: t.thumbnail,
            category: t.category,
            price: t.price,
            images: t.images?.map(i => i.url),
            date: t.publishingDate,
            description: t.description,
            seller: {
                id: req.user.id,
                name: req.user.name,
                avatar: req.user.avatar
            },
        };
    });

    // And send the response back.
    res.json({ tasks: listings });
};