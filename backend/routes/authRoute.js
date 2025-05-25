import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  GetUser,
  UserOrder,
  DeleteUser,
  ChatBot,
  approveProduct,
  getNonSellerUsersController,
  addToCart,
  removeFromCart,
  updateCartItem,
  checkoutCart,
  getCart,
  AdminOrders
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);
router.post("/approve-all-products", approveProduct);



//LOGIN || POST
router.post("/login", loginController);

router.get("/get-user", GetUser);
router.get("/user-orders/:user_id", UserOrder);
router.get("/all-orders-admin", AdminOrders);



router.get("/get-non-seller", getNonSellerUsersController);


router.delete("/delete-user/:id", DeleteUser);
router.post("/chatbot", ChatBot);
// router.put("/:userId/add-product", AddProduct);
// In your authRoutes.js or userRoutes.js
router.get('/:userId/cart', getCart);
router.put('/:userId/add-to-cart', addToCart);
router.put('/:userId/update-cart/:productId', updateCartItem);
router.delete('/:userId/remove-from-cart/:productId', removeFromCart);
router.post('/:userId/checkout', checkoutCart);










//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected Admin route auth
// router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
//   res.status(200).send({ ok: true });
// });
router.get("/admin-auth", (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
