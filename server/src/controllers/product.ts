import { UploadApiResponse } from "cloudinary";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import cloudUploader from "src/cloud";
import ProductModel from "src/models/product";
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

export const updateProduct: RequestHandler = async (req, res) => {
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

    if (task.images.length >= 3) {
        return sendErrorRes(res, 'Task already has 3 images!', 422);
    }

    if (isMultipleImages) {
        if (task.images.length + images.length > 3) {
            return sendErrorRes(res, `Image files can't be more than 3!`, 422)
        }
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