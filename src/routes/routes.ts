import express from "express"
import authRoutes from "../modules/auth/auth.routes.ts";
import productRoutes from "../modules/product/product.routes.ts";
import supermarketRoutes from "../modules/supermarket/supermarket.routes.ts";
import customerRoutes from "../modules/customer/customer.routes.ts";
import invoiceRoutes from "../modules/invoice/invoice.routes.ts";


const router=express.Router()

router.use('/api/auth', authRoutes)
router.use('/api/products', productRoutes)
router.use('/api/supermarkets', supermarketRoutes)
router.use('/api/customers', customerRoutes)
router.use('/api/invoices', invoiceRoutes)


export default router
