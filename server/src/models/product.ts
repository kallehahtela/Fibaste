import { Document, model, Schema } from "mongoose";
import categories from "src/utils/categories";

type productImage = { url: string; id: string };

export interface ProductDocument extends Document {
    owner: Schema.Types.ObjectId;
    name: string;
    price: number;
    publishingDate: Date;
    category: string;
    images: productImage[];
    thumbnail: string;
    description: string;
};

const schema = new Schema<ProductDocument>({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        enum: [...categories],
        required: true,
    },
    publishingDate: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: [{
        type: Object,
        url: String,
        id: String,
    }],
    thumbnail: String,
}, { timestamps: true });


const ProductModel = model('Product', schema);
export default ProductModel;