const mongoose = require('mongoose');
const { schema } = require('./Courses');
const Schema = mongoose.Schema;
const user = new Schema ({
    
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique:true,
        required: true
    },
    contactNo:{
        type: Number,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    }
    



},{
    timestamps: true
}
);

const User = mongoose.model('user', user);

module.exports = User;