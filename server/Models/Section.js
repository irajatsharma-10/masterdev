const mongoose = require("mongoose");
const SectionSchema = new mongoose.Schema({
    SectionName:{
        type:String,
    },
    subSection:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subsection',
        required:true,
    }],
})

module.exports  = mongoose.model('Section', SectionSchema);