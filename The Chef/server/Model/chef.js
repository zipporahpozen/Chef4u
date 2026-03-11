import mongoose from 'mongoose';
import menuModel from './menu.js';
const chefSchema = new mongoose.Schema({
  name: { type: String, default: 'Unknown' },
  password: { type: String, required: true,unique: true },
  email: { type: String, required: true, index: true, unique: true }, 
  description: { type: String, default: 'No description provided' }, 
  image: { type: String, default: 'default-image.jpg' },
  galery: { type: [String], default: [] },
  dateAddToWebsite: { type: Date, default: Date.now },
  status: { type: Boolean, default: true }, 
  category: { type: String, default: 'Uncategorized' }, 
  typeKitchen: { type: [String], default: [] }, 
  followers:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Uesr', default: [] }],
  isApproved: { type: Boolean, default: false },
  myMenu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu', default: [] }]
});

const chefModel = mongoose.model('chefModel', chefSchema);

export default chefModel;