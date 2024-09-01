const Course = require('../Models/Course');
const Tag = require("../Models/Category");
const User = require("../Models/User");
const Category = require("../Models/Category");
const {uploadImageToCloudinary} = require('../Utils/ImageUploader');
// create course handler
exports.createCourse = async (req,res)=>{
    try{
        // fetch all the data
        let {courseName, courseDescription, whatYouWillLearn, price , category, tag:_tag} = req.body;
        // tag: _tag is a way to rename the tag property of the object to _tag for use within your code. (this is called aliasing)
//         Aliases help avoid naming conflicts and make it clear that these variables are specifically for certain processing tasks. For instance, you might want to parse _tag and _instructions but use tag and instructions for other purposes in the code.
// Flexibility in Processing:

// When using aliases, you can keep the original variable names (e.g., tag, instructions) available for other uses, or you might have a different naming convention for the parsed or transformed data.
        // get thumbnail
        const thumbnail = req.files.thumbnailImage; 
        

// Purpose: Converts a JSON string into a JavaScript object or array.
// Usage: You use JSON.parse() when you receive data as a JSON string and you need to convert it into a JavaScript data structure (like an object or array) that you can work with in your code.
// JSON.stringify()
        const tag = JSON.parse(_tag);

// Purpose: Converts a JavaScript object or array into a JSON string.
// Usage: You use JSON.stringify() when you need to send data as a JSON string (e.g., for API responses or storing in a text-based format).
        // validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag.length || !thumbnail){
            return res.status(400).json({
                success: false,
                message: "All fields are required", 
            })
        }

        // check for instructor
        const userId = req.user.id;// payload mein jo store ki thi
        const instructorDetails = await User.findById(userId,{
            accountType:"Instructor",
        });
        const categoryDetails  = await Category.findById(category);
        console.log("Instructor Details: ",instructorDetails);
        // TODo check instructorDetails._id and userId is same or different
        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: 'Instructor Details not found',
            })
        }

        // // check given tag is valid or not
        // const tagDetails = await Course.findOne({tag: tag});
        // if(!tagDetails){
        //     return res.status(404).json({
        //         success: false,
        //         message: 'Tag Details not found',
        //     })
        // }

        // upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            // whenever you create the course you have to tell the object Id of the instructor
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag,// this is where the parse tag is used to store the array into the DB
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,

        })

        // add the new course to the user schema of the instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new: true},
        );

        // update the tag k schema
        // return response
        return res.status(200).json({
            success: true,
            message: "Course Created Successfully",
            data: newCourse,
        })
    }catch(error){
        console.log("Failed to create the course", error)
        return res.status(500).json({
            success: false,
            message: "Failed to create the course",
            error: error.message,  
        })
    }
}

// getAll Courses handler

exports.getAllCourses = async (req,res)=>{
    try{
        const allCourses = await Course.find({},{
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true,
        }).populate("instructor").exec();
        return res.status(200).json({
            success: true,
            message: "Data for all course fetched successfully",
            data: allCourses,
        })

    }catch(error){
        console.log("Not able to fetch all the course",error);
        return res.status(500).json({
            success: false,
            message: "Cannot fetch course data",
            error: error.message,
        })
    }
}

// getCourseDetails
exports.getCourseDetails = async(req,res)=>{
    try{

        // fetch the information
        const {courseId} = req.body;
        //get all the detail

        // path mtlb us key k reference mein jis model k reference ho wha chle jao 
        const courseDetails = await Course.findOne({_id: courseId}).populate({path: "instructor",populate:{
            path:"additionalDetails"
        }}).populate("category").populate("ratingAndReviews").populate({path:"courseContent",populate:{path:"subSection"}}).exec();
        // valid the information
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: "could not find the course with valid course id",
            })
        }
        // return response
        return res.status(200).json({
            success: true,
            message: "All the courseDetails fetched successfully",
            courseDetails,
        })
    }catch(error){
        console.log("Error in getting the course details ",error);
        return res.status(200).json({
            success: false,
            message: "Couldnot able to fetch the course details"
        })
    }
}

// getFullCourseDetails
// editCourse
// getInstructorCourses
// deleteCourse