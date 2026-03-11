import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
    dateOrder: {
        type: Date,
        default: Date.now
    },
    dateEvent: {
      type: Date
    },
    chefOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chef'
    },
    menuOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    },
    price: {
        type: Number
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: Boolean,
        default: false
    },
    amountDiners: {
        type: Number,
        default: 0 // ערך ברירת מחדל של 0
    }
});

const orderModel = mongoose.model('orderModel', orderSchema);
export default orderModel;
