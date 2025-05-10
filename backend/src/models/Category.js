import { Schema, model } from 'mongoose';

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default model('Category', CategorySchema);