import { Schema, model } from 'mongoose';

const ShopSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    ownerName: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        min: 9
    },
    description: {
        type: String,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    logo: {
        type:String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default model('Shop', ShopSchema);