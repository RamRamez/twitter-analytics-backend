import { model, Schema } from 'mongoose';
// const mongoose = require('mongoose');
// const { Schema, model } = mongoose;

const userModel = new Schema({
	id: { type: String, required: true, unique: true },
	username: { type: String, required: true },
	profile_image_url: { type: String, required: true },
	name: { type: String, required: true },
});

const userSchema = model('userModelSimple', userModel, 'allUsers');

module.exports = userSchema;
