import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";


import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import axios from "axios"

export const registerController = async (req, res) => {
  try {
    const { name, email, password, user_type, phone, user_type_data } = req.body;

    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }

    const hashedPassword = await hashPassword(password);

    // Create user data object
    const userData = {
      name,
      email,
      password: hashedPassword,
      user_type,
      phone
    };

    // Only add user_type_data if it exists and user_type is not Seller
    if (user_type !== "Seller" && user_type_data) {
      userData.user_type_data = user_type_data;
    }

    const user = await new userModel(userData).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};
export const getNonSellerUsersController = async (req, res) => {
  try {
    // Find all users where user_type is not "Seller"
    const nonSellerUsers = await userModel.find({
      user_type: { $ne: "Seller" }
    }).select("-password"); // Exclude password field from the response

    res.status(200).send({
      success: true,
      message: "Non-seller users fetched successfully",
      count: nonSellerUsers.length,
      data: nonSellerUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching non-seller users",
      error,
    });
  }
};
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId)
      .populate('cart.product', 'name price image')
      .select('cart');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      cart: user.cart
    });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity = 1 } = req.body;

    // Validate inputs
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find user and update cart
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if product already in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if already in cart
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    res.status(200).json({
      success: true,
      cart: user.cart,
      message: 'Product added to cart successfully'
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    // Validate inputs
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find item in cart
    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex < 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }

    // Update quantity
    user.cart[itemIndex].quantity = quantity;
    await user.save();

    res.status(200).json({
      success: true,
      cart: user.cart,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove item from cart
    user.cart = user.cart.filter(
      item => item.product.toString() !== productId
    );

    await user.save();

    res.status(200).json({
      success: true,
      cart: user.cart,
      message: 'Product removed from cart successfully'
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const checkoutCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if cart is empty
    if (user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Move items from cart to products (as pending) with quantities
    const newProducts = user.cart.map(item => ({
      product: item.product,
      status: false,
      quantity: item.quantity  // Include the quantity
    }));

    // Check for existing products and update quantities if they exist
    for (const newProduct of newProducts) {
      const existingProductIndex = user.products.findIndex(
        p => p.product.toString() === newProduct.product.toString()
      );

      if (existingProductIndex >= 0) {
        // Product exists, update quantity
        user.products[existingProductIndex].quantity += newProduct.quantity;
      } else {
        // Add new product
        user.products.push(newProduct);
      }
    }

    user.cart = []; // Clear cart
    await user.save();

    res.status(200).json({
      success: true,
      user,
      message: 'Checkout successful. Products are now pending.'
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
export const approveProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required"
      });
    }

    // Find the user and remove the product from their products array
    const user = await userModel.findByIdAndUpdate(
      userId,
      { $pull: { products: { _id: productId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product approved and removed successfully",
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in approving product",
      error: error.message
    });
  }
};
//POST LOGIN
export const loginController = async (req, res) => {
  try {
    console.log(req.body)
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user?._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
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

export const GetUser = async (req, res) => {
  try {

    //check user
    const user = await userModel.find({ role: 0 });


    res.status(200).send({
      success: true,
      message: "Users get successfully",
      data: user
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something wents wrong",
      error,
    });
  }
};
export const DeleteUser = async (req, res) => {
  try {

    //check user
    const user = await userModel.findByIdAndDelete(req.params.id);


    res.status(200).send({
      success: true,
      message: "Users delete successfully",
      data: user
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something wents wrong",
      error,
    });
  }
};

//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};
export const ChatBot = async (req, res) => {
  const { message } = req.body
  let data = JSON.stringify({
    "model": "deepseek/deepseek-prover-v2:free",
    "messages": [
      {
        "role": "user",
        "content": message
      }
    ]
  });
  console.log(data)

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://openrouter.ai/api/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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'
    },
    data: data
  };

  const result = await axios.request(config)
  res.status(200).send({
    success: true,
    message: "Password Reset Successfully",
    data: result.data.choices[0].message.content
  });

};


//update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, password } = req.body;
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
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

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
