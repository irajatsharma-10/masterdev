const Section = require('../Models/Section');
const Subsection = require("../Models/Subsection");
const { uploadImageToCloudinary } = require('../Utils/ImageUploader');


// create subsection

exports.createSubSection = async (req,res)=>{
    try{
        // fetch the data from req body
        // kuch data milta h and kuch data khud se import krna pdta h
        const {title, timeDuration,description,sectionId} = req.body;
        // extract file/video
        const videoFile = req.files.videoFileKey;
        // validation
        if(!title || !timeDuration || !description || !sectionId){
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }
        // file type validation
        const videoType = videoFile.name.split('.')[1].toLowerCase();
        const supportedType = [".mv",".mp3"];
        if(supportedType.includes(videoType)){
            return res.status(400).json({
                success: false,
                message: "Not a valid file type"
            })
        }
        // upload video to cloudinary(response mein secure url mil jayega)
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // create a subsection
        const subSectionDetails = Subsection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })
        // store the subsection id into the section
        const updatedSection = await Section.findByIdAndUpdate({_id: sectionId},
            {
                $push:{
                    subSection: subSectionDetails._id
                }
            },{new: true}
        ).populate("subSection").exec();
        console.log(updatedSection);
        // return response
        return res.status(200).json({
            success: true,
            message:"Subsection created successfully",
            updatedSection,
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to create the subsection, please try again later"
        })
    }
}
// update subsection

exports.updateSubSection = async (req,res)=>{
    try{
        // fetch the data from req body
        // kuch data milta h and kuch data khud se import krna pdta h
        const {title, timeDuration,description,sectionId} = req.body;
        // extract file/video
        const videoFile = req.files.videoFileKey;
        // validation
        if(!title || !timeDuration || !description || !sectionId){
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }
        const videoType = videoFile.name.split('.')[1].toLowerCase();
        const supportedType = [".mv",".mp3"];
        if(supportedType.includes(videoType)){
            return res.status(400).json({
                success: false,
                message: "Not a valid file type"
            })
        }
        // upload video to cloudinary(response mein secure url mil jayega)
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // no need to create the subsection while updating

        // // create a subsection
        // const subSectionDetails = Subsection.create({
        //     title: title,
        //     timeDuration: timeDuration,
        //     description: description,
        //     videoUrl: uploadDetails.secure_url,
        // })

        // store the subsection id into the section
        const updatedSection = await Section.findByIdAndUpdate({_id: sectionId},
            {
                title, description,timeDuration,videoUrl: uploadDetails.secure_url
            },{new: true}
        ).populate("subSection").exec();
        console.log(updatedSection);
        // return response
        return res.status(200).json({
            success: true,
            message:"Subsection created successfully",
            updatedSection,
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to create the subsection, please try again later"
        })
    }
}

exports.deleteSubSection = async (req,res)=>{
    try{
        const {subSectionId} = req.body;
        if(!subSectionId){
            return res.status(401).json({
                message: 'Missing subsectionId',
                success: false,
            })
        }
        await Subsection.findByIdAndDelete(SubSectionId);
        return res.status(200).json({
            success: true,
            message: "Subsection deleted successfully",
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message:"Unable to delete the sub-section , Please try again later"
        })
    }
}

