import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    password: {type:String,uniqe:true},
    email: {type:String,required: true, index: true, unique: true },
    myChef: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chef', default: [] }],
    myOrder:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: [] }]
});
const userModel = mongoose.model('userModel', userSchema);
export default userModel;