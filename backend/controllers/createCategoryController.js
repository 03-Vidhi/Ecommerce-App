import CategoryModel from "../models/CategoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category Already Exisits",
      });
    }
    const category = await new CategoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New Category Created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in category",
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While updating category",
    });
  }
};

export const categoryController = async (req,res) => {
    try {
        const category = await CategoryModel.find({})
        res.status(200).send({
            success: true,
            message: "All Categories found",
            category,
        });
        
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in getting category"
      })  
    }
}

export const singleCategoryController = async (req,res) => {
    try {
      const category = await CategoryModel.findOne({slug: req.params.slug});
      res.status(200).send({
        success:true,
        message: "get single category successfully done",
        category,
      }); 
    } catch (error) {
     console.log(error);
    res.status(500).send({
        success: false,
        error,
        message: "Error While Getting single category"
    })  
    }
}

export const deleteCategoryController = async (req,res) => {
    try {
        const {id} = req.params;
        await CategoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message: "Successfully deleted",
        });
        
    } catch (error) {
       console.log(error);
       res.status(500).send({
        success:false,
        error,
        message: "Error in deleting the category"
       }) 
    }
}