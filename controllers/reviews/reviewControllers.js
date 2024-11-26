const reviewDB = require("../../models/reviews/reviewModel");

// create review
exports.createReview = async(req,res)=>{
    const {recipeid} = req.params;
    const {username,rating,description} = req.body;

    if(!username|| !rating || !description){
        res.status(400).json({error:"All Filed are required"})
    }

    try {
        const addReview = new reviewDB({
            userId:req.userId,recipeid,username,rating,description
        });

        await addReview.save();
        res.status(200).json({message:"Review Sucessfully Added",addReview})
    } catch (error) {
        console.log("error",error);
        res.status(500).json({error:error})
    }
}

// getRecipeReview
exports.getRecipeReview = async(req,res)=>{
    const {recipeid} = req.params;
    try {
        const getReview = await reviewDB.find({recipeid:recipeid});
        res.status(200).json(getReview)
    } catch (error) {
        console.log("error",error);
        res.status(500).json({error:error})
    }
}

// deleteReview
exports.deleteReview = async(req,res)=>{
    const {reviewid} = req.params;
    try {
        const DeleteReview = await reviewDB.findByIdAndDelete({_id:reviewid});
        res.status(200).json({message:"review delet",DeleteReview})
    } catch (error) {
        console.log("error",error);
        res.status(500).json({error:error})
    }
}