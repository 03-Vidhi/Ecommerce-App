import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js"
import JWT from "jsonwebtoken";

// register controller
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    // validations
    if (!name) {
      return res.send({ message: "Name is required" });
    }

    if (!email) {
      return res.send({ message: "Email is required" });
    }

    if (!password) {
      return res.send({ message: "Password is required" });
    }

    if (!phone) {
      return res.send({ message: "Phone Number is required" });
    }

    if (!address) {
      return res.send({ message: "Address is required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is required" });
    }

    // check user
    const existingUser = await userModel.findOne({ email });
    // exisitingUser
    if (existingUser) {
      res.status(200).send({
        success: true,
        message: "Already register please login ",
      });
    }
    // register user
    const hashedPassword = await hashPassword(password);
    // save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      answer,
      password: hashedPassword,
    });
    user.save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registeration",
      error,
    });
  }
};

// login controller

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "invalid email-id and password",
      });
    }
    // check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email-Id is not registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      res.status(200).send({
        success: false,
        message: "Password is not correct",
      });
    }
    // token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_Secret, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// forgot password controller
export const forgotPasswordController = async (req, res) => {
  try {
    const {email, answer, newpassword} = req.body;
    if(!email){
      res.status(400).send({message: "Email is required"})
    }
    if(!answer){
      res.status(400).send({message: "Answer is required"})
    }
    if(!newpassword){
      res.status(400).send({message: "New Password is required"})
    }
    // check
    const user = await userModel.findOne({email, answer});
    // validation
    if(!user){
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer"
      })
    }
    const hashed = await hashPassword(newpassword);
    await userModel.findByIdAndUpdate(user._id, {password: hashed});
    return res.status(200).send({
      success: true,
      message: "Password Reset Successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong",
      error
    })
  }
}

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

// update profile 
export const updateProfileController = async (req,res) => {
  try {
    const {name, email,password, address, phone} = req.body
    const user = await userModel.findById(req.user._id);
     //password
     if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
    
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message: "Error while updating profile",
      error,
    })
  }
}

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};