import express from "express";
import handler, {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
  createProductReviewController,
  getUserProductReviewController,
  getUserById,
  deleteReview,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
router.post(
  "/create-product",
  // requireSignIn,
  // isAdmin,

  createProductController
);
//routes
router.put(
  "/update-product/:pid",
  // requireSignIn,
  // isAdmin,

  updateProductController
);

//get products
router.get("/get-product", getProductController);
router.post("/handler", handler);



//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/delete-product/:pid", deleteProductController);
// review producct

router.post(
  "/review-product/:productId",
  // requireSignIn,
  createProductReviewController
);
// Get user's review for a product
router.get("/review/:productId", requireSignIn, getUserProductReviewController);

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);
//get user by there review details
router.get("/user/:id", getUserById);
// DELETE a specific review by product ID and review ID
router.delete("/product-details/:productId/review/:reviewId", deleteReview);

export default router;
