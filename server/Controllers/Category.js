const Category = require('../Models/Category');
const Tag = require('../Models/Category');
// create tag k handler function liko
exports.createCategory = async(req,res)=>{
    try{
        const {name, description} = req.body;
        if(!name || !description){
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }
        // create the entry in Database
        const CategoryDetails = await Category.create({
            name: name,description: description
        })
        console.log(CategoryDetails);
        return res.status(200).json({
            success: true,
            message: "Category created successfully",
            CategoryDetails
        })
        // whenever we create the course we'll make sure to update the Category
    }catch(error){
        return res.status(500).json({
            success: false,
            message: " Not able to create the Category",error,
        }) 
    }
}

// getAll Category
exports.showAllCategories = async (req, res)=>{
    try{
        // dont want Category on the basis of any particular entry but make sure to include name and description
        const allCategories = await Category.find({}, {name: true, description: true});
        return res.status(200).json({
            message: "All Category return successfully",
            success: true,
            data: allCategories,
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: " Not able to create the Category",error,
        })
    }
}

// categoryPageDetails
exports.categoryPageDetails = async (req,res)=>{
    try{
        // get category id
        const {categoryId} = req.body;

        // get courses for specified category id
        const selectedCategory = await Category.findById(categoryId).populate("courses").exec();

        // validation
        if(!selectedCategory){
            console.log("Selected category not found");
            return res.status(404).json({
                success: false,
                message: "Selected Courses not found",
            })
        }
        // get course for different category
        const differentCategories = await Category.find({_id: {$ne: categoryId}}).populate("courses").exec();

        // get top selling courses

        // return response
        return res.status(200).json({
            success: true,
            data:{
                selectedCategory,
                differentCategories,
            }
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: error.message,
        })
    }
}