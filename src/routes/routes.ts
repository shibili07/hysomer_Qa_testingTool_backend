import express from "express"
import authRoutes from "../modules/auth/auth.routes.ts";
import productRoutes from "../modules/product/product.routes.ts";

const router=express.Router()

router.use('/api/auth', authRoutes)
router.use('/api/products', productRoutes)

export default router
