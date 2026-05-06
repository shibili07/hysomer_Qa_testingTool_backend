import mongoose from "mongoose";
import dotenv from "dotenv";
import { ProductModel } from "../modules/product/product.model.ts";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGO_URI;

const brands = [
  "Nirapara", "Eastern", "Brahmins", "Double Horse", "Milma", "Kera", "Pavizham", "Saras", "Elite", "Kitchen Treasures",
  "KPL Shudhi", "Parachute", "Horlicks", "Boost", "Bournvita", "Tata Tea", "Kanan Devan", "Bru", "Nescafe", "Sunlight",
  "Surf Excel", "Vim", "Dettol", "Lifebuoy", "Medimix", "Chandrika", "Aashirvaad", "Fortune", "Saffola", "Maggi"
];

const categories = [
  {
    name: "Rice & Grains",
    items: [
      { name: "Matta Rice", weights: ["1kg", "5kg", "10kg"], basePrice: 55 },
      { name: "Ponni Rice", weights: ["1kg", "5kg", "10kg"], basePrice: 48 },
      { name: "Jaya Rice", weights: ["1kg", "5kg", "10kg"], basePrice: 42 },
      { name: "Puttu Podi", weights: ["500g", "1kg"], basePrice: 50 },
      { name: "Appam/Idiyappam Podi", weights: ["500g", "1kg"], basePrice: 55 },
      { name: "Roasted Rice Flour", weights: ["500g", "1kg"], basePrice: 45 },
      { name: "Wheat Flour (Atta)", weights: ["1kg", "5kg"], basePrice: 60 }
    ]
  },
  {
    name: "Spices & Masalas",
    items: [
      { name: "Chilly Powder", weights: ["100g", "250g", "500g"], basePrice: 40 },
      { name: "Turmeric Powder", weights: ["100g", "250g"], basePrice: 35 },
      { name: "Coriander Powder", weights: ["100g", "250g", "500g"], basePrice: 30 },
      { name: "Sambar Powder", weights: ["100g", "250g"], basePrice: 65 },
      { name: "Chicken Masala", weights: ["100g", "250g"], basePrice: 70 },
      { name: "Meat Masala", weights: ["100g", "250g"], basePrice: 75 },
      { name: "Fish Masala", weights: ["100g", "250g"], basePrice: 65 },
      { name: "Garam Masala", weights: ["50g", "100g"], basePrice: 55 }
    ]
  },
  {
    name: "Oils & Ghee",
    items: [
      { name: "Coconut Oil", weights: ["500ml", "1L", "2L"], basePrice: 180 },
      { name: "Sunflower Oil", weights: ["1L", "2L", "5L"], basePrice: 140 },
      { name: "Gingelly Oil", weights: ["500ml", "1L"], basePrice: 220 },
      { name: "Ghee", weights: ["100ml", "200ml", "500ml"], basePrice: 650 }
    ]
  },
  {
    name: "Dairy & Breakfast",
    items: [
      { name: "Milk", weights: ["500ml"], basePrice: 25 },
      { name: "Curd", weights: ["500g"], basePrice: 35 },
      { name: "Butter", weights: ["100g", "500g"], basePrice: 55 },
      { name: "Paneer", weights: ["200g"], basePrice: 90 },
      { name: "Bread", weights: ["400g"], basePrice: 45 },
      { name: "Oats", weights: ["500g", "1kg"], basePrice: 160 },
      { name: "Corn Flakes", weights: ["500g"], basePrice: 180 }
    ]
  },
  {
    name: "Snacks & Sweets",
    items: [
      { name: "Banana Chips", weights: ["200g", "500g"], basePrice: 90 },
      { name: "Sarkara Varatti", weights: ["200g", "500g"], basePrice: 110 },
      { name: "Potato Chips", weights: ["100g"], basePrice: 30 },
      { name: "Murukku", weights: ["200g"], basePrice: 45 },
      { name: "Mixture", weights: ["200g", "500g"], basePrice: 55 },
      { name: "Biscuits", weights: ["100g", "250g"], basePrice: 20 },
      { name: "Chocolate", weights: ["40g", "100g"], basePrice: 20 }
    ]
  },
  {
    name: "Beverages",
    items: [
      { name: "Tea Powder", weights: ["250g", "500g"], basePrice: 120 },
      { name: "Coffee Powder", weights: ["100g", "250g"], basePrice: 95 },
      { name: "Health Drink", weights: ["500g"], basePrice: 280 },
      { name: "Fruit Juice", weights: ["1L"], basePrice: 110 },
      { name: "Soft Drink", weights: ["600ml", "2L"], basePrice: 40 }
    ]
  },
  {
    name: "Household & Personal Care",
    items: [
      { name: "Dishwash Liquid/Bar", weights: ["250g", "500ml"], basePrice: 35 },
      { name: "Detergent Powder", weights: ["500g", "1kg", "5kg"], basePrice: 80 },
      { name: "Bath Soap", weights: ["100g", "125g"], basePrice: 45 },
      { name: "Toothpaste", weights: ["100g", "200g"], basePrice: 55 },
      { name: "Shampoo", weights: ["100ml", "400ml"], basePrice: 85 },
      { name: "Face Wash", weights: ["100ml"], basePrice: 120 }
    ]
  }
];

type SeedProduct = {
  productName: string;
  price: number;
  productId: string;
  taxAmount: number;
  discountAmount: number;
  stock: number;
};

const generateProducts = (): SeedProduct[] => {
  const products: SeedProduct[] = [];
  let idCounter = 1000;

  while (products.length < 1000) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    if (!category) continue;
    const item = category.items[Math.floor(Math.random() * category.items.length)];
    if (!item) continue;
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const weight = item.weights[Math.floor(Math.random() * item.weights.length)];
    if (!weight) continue;

    let price = item.basePrice;
    if (weight.includes("kg") || weight.includes("L")) {
      const val = parseFloat(weight);
      price = item.basePrice * val;
    } else if (weight.includes("g") || weight.includes("ml")) {
      const val = parseFloat(weight);
      price = (item.basePrice / 1000) * val;
    }

    price = Math.round(price * (0.95 + Math.random() * 0.1));

    const productName = `${brand} ${item.name} (${weight})`;

    if (!products.find((p) => p.productName === productName)) {
      products.push({
        productName,
        price,
        productId: `PROD-${idCounter++}`,
        taxAmount: Math.round(price * 0.12),
        discountAmount: Math.random() > 0.7 ? Math.round(price * 0.05) : 0,
        stock: Math.floor(Math.random() * 500) + 50,
      });
    }
  }
  return products;
};

const seedDB = async () => {
  try {
    if (!MONGO_URI) throw new Error("MONGO_URI not found");
    
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing products? Optional. User didn't ask to clear.
    // await ProductModel.deleteMany({});
    
    const products = generateProducts();
    await ProductModel.insertMany(products);
    
    console.log(`Successfully seeded ${products.length} products!`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDB();
