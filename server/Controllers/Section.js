const Section= require("../Models/Section");
const Course = require("../Models/Course");

exports.createSection = async(req,res)=>{
    try{
        // data fetch
        // courseId to update the course
        // sectionName to update its entry in Database
        const {sectionName , courseId} = req.body;
        // data validation
        if(!sectionName || !courseId){
            return res.status(401).json({
                success: false,
                message:'Missing Properties',
            })
        }
        // create section(section ko create kro and Course mein update krdo)
        const newSection = Section.create({
            sectionName
        })
        // update course with section objectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent: newSection._id, // courseContent is storing the section id

                }
            },
            {new: true},// to get the updated document into the db
        ).populate({
            path: "courseContent",// courseContent  is the (key) child of Course referencing the Section model path
            populate:{
                path: "subSection"// SubSection is the child of Section
                // no need to provide the path if only want to populate the child model
            },
        }).exec();
        // return response
        return res.status(200).json({
            success: true,
            message:"Section created successfully",
            updatedCourseDetails,

        })
    }catch(error){
        console.log("Section not created",error);
        return res.status(500).json({
            success: false,
            message: "Unable to create the section , please try again later"
        })
    }
}

exports.updateSection = async (req,res)=>{
    try{
        // data input
        const {sectionName, sectionId} = req.body;
        // data validation
        if(!sectionName || !sectionId){
            return res.status(401).json({
                success: false,
                message:'Missing Properties',
            })
        }
        // update the data(no need to create the update section inside the course as there's already the section id present inside the course and id update nhi hogi)
        const updatedSection = await Section.findByIdAndUpdate({_id: sectionId}, {sectionName}, {new: true})
        // return response
        return res.status(200).json({
            success: true,
            message:"Section update successfully",
            updatedSection,
        })

    }catch(error){
        console.log("Section not created",error);
        return res.status(500).json({
            success: false,
            message: "Unable to update the section , please try again later"
        })
    }
}
exports.deleteSection = async (req,res)=>{
    try{
        // get Id - assuming that we are sending ID in params
        const { sectionId} = req.body;
        // data validation
        if( !sectionId){
            return res.status(401).json({
                success: false,
                message:'Missing Properties',
            })
        }
        // update the data(no need to create the update section inside the course as there's already the section id present inside the course and id update nhi hogi)
        // const deletedSection = await Course.findByIdAndDelete(sectionId, {$pull:{courseContent: sectionId}}, {new: true})
        await Section.findByIdAndDelete(sectionId);
        // return response
        return res.status(200).json({
            success: true,
            message:"Section deleted successfully",
        })

    }catch(error){
        console.log("Section not created",error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete the section , please try again later"
        })
    }
}

