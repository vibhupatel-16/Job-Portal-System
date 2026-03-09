import mongooes from 'mongoose';
const applicationSchema = new mongooes.Schema({
    job:{
        type:mongooes.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    applicant:{
        type:mongooes.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
   // application.model.js mein update karein
statusHistory: [
    {
        status: String,
        changedAt: { type: Date, default: Date.now }
    }
],
    status:{
        type:String,
        enum:['pending','shortlisted', 'accepted', 'rejected'],
        default:'pending'
    }
    
}, {timestamps:true});

export const Application = mongooes.model("Application", applicationSchema)