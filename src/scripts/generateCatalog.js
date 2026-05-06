const brands = [
  "Nirapara", "Eastern", "Brahmins", "Double Horse", "Milma", "Kera", "Pavizham", "Saras", "Elite", "Kitchen Treasures",
  "KPL Shudhi", "Parachute", "Horlicks", "Boost", "Bournvita", "Tata Tea", "Kanan Devan", "Bru", "Nescafe", "Sunlight",
  "Surf Excel", "Vim", "Dettol", "Lifebuoy", "Medimix", "Chandrika", "Aashirvaad", "Fortune", "Saffola", "Maggi"
];

const categories = [
  {
    name: "staples",
    items: [
      { name: "Matta Rice", weights: ["1kg", "5kg", "10kg"], basePrice: 55 },
      { name: "Ponni Rice", weights: ["1kg", "5kg", "10kg"], basePrice: 48 },
      { name: "Jaya Rice", weights: ["1kg", "5kg", "10kg"], basePrice: 42 },
      { name: "Sugar", weights: ["1kg", "2kg"], basePrice: 46 },
      { name: "Toor Dal", weights: ["1kg"], basePrice: 158 },
      { name: "Moong Dal", weights: ["1kg"], basePrice: 142 }
    ]
  },
  {
    name: "flours",
    items: [
      { name: "Puttu Podi", weights: ["500g", "1kg"], basePrice: 50 },
      { name: "Appam/Idiyappam Podi", weights: ["500g", "1kg"], basePrice: 55 },
      { name: "Roasted Rice Flour", weights: ["500g", "1kg"], basePrice: 45 },
      { name: "Wheat Flour (Atta)", weights: ["1kg", "5kg"], basePrice: 60 },
      { name: "Maida", weights: ["1kg"], basePrice: 55 }
    ]
  },
  {
    name: "masalaSpices",
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
    name: "oilsGhee",
    items: [
      { name: "Coconut Oil", weights: ["500ml", "1L", "2L"], basePrice: 180 },
      { name: "Sunflower Oil", weights: ["1L", "2L", "5L"], basePrice: 140 },
      { name: "Gingelly Oil", weights: ["500ml", "1L"], basePrice: 220 },
      { name: "Ghee", weights: ["100ml", "200ml", "500ml"], basePrice: 650 }
    ]
  },
  {
    name: "dairy",
    items: [
      { name: "Milk", weights: ["500ml"], basePrice: 25 },
      { name: "Curd", weights: ["500g"], basePrice: 35 },
      { name: "Butter", weights: ["100g", "500g"], basePrice: 55 },
      { name: "Paneer", weights: ["200g"], basePrice: 90 }
    ]
  },
  {
    name: "beverages",
    items: [
      { name: "Tea Powder", weights: ["250g", "500g"], basePrice: 120 },
      { name: "Coffee Powder", weights: ["100g", "250g"], basePrice: 95 },
      { name: "Health Drink", weights: ["500g"], basePrice: 280 },
      { name: "Fruit Juice", weights: ["1L"], basePrice: 110 },
      { name: "Soft Drink", weights: ["600ml", "2L"], basePrice: 40 }
    ]
  },
  {
    name: "snacksBiscuits",
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
    name: "produce",
    items: [
      { name: "Onion", weights: ["1kg"], basePrice: 48 },
      { name: "Tomato", weights: ["1kg"], basePrice: 35 },
      { name: "Potato", weights: ["1kg"], basePrice: 42 },
      { name: "Ginger", weights: ["250g"], basePrice: 60 },
      { name: "Garlic", weights: ["250g"], basePrice: 55 },
      { name: "Green Chilli", weights: ["250g"], basePrice: 25 },
      { name: "Nendran Banana", weights: ["1kg"], basePrice: 75 }
    ]
  },
  {
    name: "personalCare",
    items: [
      { name: "Bath Soap", weights: ["100g", "125g"], basePrice: 45 },
      { name: "Toothpaste", weights: ["100g", "200g"], basePrice: 55 },
      { name: "Shampoo", weights: ["100ml", "400ml"], basePrice: 85 },
      { name: "Face Wash", weights: ["100ml"], basePrice: 120 }
    ]
  },
  {
    name: "household",
    items: [
      { name: "Dishwash Liquid/Bar", weights: ["250g", "500ml"], basePrice: 35 },
      { name: "Detergent Powder", weights: ["500g", "1kg", "5kg"], basePrice: 80 },
      { name: "Floor Cleaner", weights: ["500ml"], basePrice: 110 },
      { name: "Toilet Cleaner", weights: ["500ml"], basePrice: 105 }
    ]
  }
];

const catalog = {};

categories.forEach(cat => {
  catalog[cat.name] = [];
  cat.items.forEach(item => {
    brands.forEach(brand => {
      item.weights.forEach(weight => {
        let price = item.basePrice;
        if (weight.includes("kg") || weight.includes("L")) {
          const val = parseFloat(weight);
          price = item.basePrice * val;
        } else if (weight.includes("g") || weight.includes("ml")) {
          const val = parseFloat(weight);
          price = (item.basePrice / 1000) * val;
        }
        price = Math.round(price * (0.95 + Math.random() * 0.1));

        catalog[cat.name].push({
          name: `${brand} ${item.name} ${weight}`,
          unitPrice: price,
          unit: weight
        });
      });
    });
  });
});

console.log("export const keralaProductCatalog = " + JSON.stringify(catalog, null, 2) + ";");
