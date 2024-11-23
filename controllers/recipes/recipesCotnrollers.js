const recipeDB = require("../../models/recipes/recipeModel");
const cloudinary = require("../../Cloudinary/cloudinary");

// create recipe
exports.createRecipe = async(req,res)=>{
    const file = req.file ? req.file.path : "";
    const { recipename, description, instructions, ingredients,cookingTime } = req.body;

    if(!recipename || !description || !ingredients || !cookingTime || !file){
        res.status(400).json({error:"all fields are required"})
    }

    const upload = await cloudinary.uploader.upload(file);

    try {
        const recipeData = new recipeDB({
            userId:req.userId,recipename, description, instructions, ingredients,cookingTime,recipeImg:upload.secure_url
        });

        await recipeData.save();
        res.status(200).json({message:"recipe create sucessfully",recipeData})
    } catch (error) {
        console.log("error",error);
        res.status(500).json({error:error})
    }
}


// update recipe
exports.updateRecipeData = async(req,res)=>{
    const {recipeid} = req.params;
    const file = req.file ? req.file.path : "";
    const { recipename, description, instructions, ingredients,cookingTime } = req.body;

    var upload;
    if(file){
        upload = await cloudinary.uploader.upload(file);
    }

    try {
        const updateREcipe = await recipeDB.findByIdAndUpdate({_id:recipeid},{
            recipename, description, instructions, ingredients,cookingTime,recipeImg:upload && upload.secure_url
        },{new:true});

        await updateREcipe.save();
        res.status(200).json({message:"recipe suceffully updated",updateREcipe})
    } catch (error) {
        console.log("error",error);
        res.status(500).json({error:error})
    }
}

// delete recipe Data
exports.deleteRecipeData = async(req,res)=>{
    const {recipeid} = req.params;

    try {
        const deleterecipe = await recipeDB.findByIdAndDelete({_id:recipeid});
        res.status(200).json({message:"recipe sucefully deleted",deleterecipe});
    } catch (error) {
        console.log("error",error);
        res.status(500).json({error:error})
    }
}

// getSingleRecipeData
exports.getSingleRecipeData = async(req,res)=>{
    const {recipeid} = req.params;

    try {
        const getSingleRecipe = await recipeDB.findOne({_id:recipeid});
        res.status(200).json(getSingleRecipe);
    } catch (error) {
        console.log("error",error);
        res.status(500).json({error:error})
    }
}

// getRecipeData
exports.getRecipeData = async(req,res)=>{
    const {page,search} = req.query;
    const pagenum = page || 1
    const searchvalue = search || "";
    const ITEM_PER_PAGE = 4;
    
    const query = {
        recipename:{$regex:searchvalue,$options:"i"}
    }
    console.log("query",query)
    try {
        const skip = (pagenum - 1) * ITEM_PER_PAGE  // 1 * 4 = 4


        // recipe count
        const count = await recipeDB.countDocuments(query);

        // page
        const pageCount = Math.ceil(count/ITEM_PER_PAGE);   // 8 / 4 = 2

        const allREcipeData = await recipeDB.aggregate([
            {
                $match:query
            },
            {
                $skip:skip
            },{
                $limit:ITEM_PER_PAGE
            },
            {
                $lookup:{
                    from:"users",
                    localField:"userId",
                    foreignField:"_id",
                    as:'userData'
                }
            }
        ]);
        res.status(200).json({
            allREcipeData,
            Pagination:{
                totalrecipeCount:count,pageCount
            }
        })
    } catch (error) {
        console.log("error",error);
        res.status(500).json({error:error})
    }
}