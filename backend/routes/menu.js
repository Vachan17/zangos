import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Inline MenuItem model
const menuItemSchema = new mongoose.Schema({
  name: String, category: String, description: String,
  variants: [{ label: String, price: Number, includes: String }],
  tags: [String], image: { type: String, default: "" },
  available: { type: Boolean, default: true },
}, { timestamps: true });

const MenuItem = mongoose.models.MenuItem || mongoose.model("MenuItem", menuItemSchema);

router.get("/", async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const items = await MenuItem.find(filter);
    res.json(items);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

router.post("/", async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.id || req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.id || req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/seed", async (req, res) => {
  try {
    await MenuItem.deleteMany({});
    const items = [
      { name:"Old Town Fried Chicken",  category:"Fried Chicken", description:"2 Juicy chicken legs, classic crispy coating", variants:[{label:"2 PC",price:299,includes:"French Fries, Ketchup, 1 Bun & 2 Dip"}], tags:["Signature"] },
      { name:"Signature Fried Chicken", category:"Fried Chicken", description:"Classic crispy fried chicken, perfectly seasoned", variants:[{label:"2 PC",price:239,includes:"French Fries, Ketchup, 1 Bun & 1 Dip"},{label:"4 PC",price:389,includes:"French Fries, Ketchup, 2 Bun & 2 Dip"}], tags:["Bestseller"] },
      { name:"Nashville Hot Chicken",   category:"Fried Chicken", description:"Fiery Nashville hot chicken — Nashville Hot / X Hot", variants:[{label:"2 PC",price:259,includes:"French Fries, Ketchup, 1 Bun & 1 Dip"},{label:"4 PC",price:399,includes:"French Fries, Ketchup, 2 Bun & 2 Dip"}], tags:["Nashville Hot","Spicy"] },
      { name:"Crispy Chicken Tenders",  category:"Tenders", description:"Golden crispy tenders with dip", variants:[{label:"2 PC",price:239,includes:"French Fries, Ketchup, 1 Bun & 1 Dip"},{label:"4 PC",price:459,includes:"French Fries, Ketchup, 2 Bun & 2 Dip"}], tags:[] },
      { name:"Nashville Hot Tenders",   category:"Tenders", description:"Nashville Hot or X Hot tenders", variants:[{label:"2 PC",price:259,includes:"French Fries, Ketchup, 1 Bun & 1 Dip"},{label:"4 PC",price:489,includes:"French Fries, Ketchup, 2 Bun & 2 Dip"}], tags:["Nashville Hot","Spicy"] },
      { name:"Original Wings",          category:"Wings", description:"Juicy original wings — 5 pcs", variants:[{label:"5 PC",price:199}], tags:[] },
      { name:"Nashville Hot Wings",     category:"Wings", description:"Nashville Hot wings — 5 pcs", variants:[{label:"5 PC",price:219}], tags:["Nashville Hot","Spicy"] },
      { name:"Delight Veg Burger",      category:"Burgers", description:"Crispy veg patty burger", variants:[{label:"Single",price:119}], tags:["Veg"] },
      { name:"Crispy Chicken Burger",   category:"Burgers", description:"Signature / Peppery / Tandoori / Nashville", variants:[{label:"Signature",price:189},{label:"Peppery",price:199},{label:"Tandoori",price:199},{label:"Nashville",price:199}], tags:["Bestseller"] },
      { name:"Crispy Chicken Wrap",     category:"Wraps", description:"Crispy chicken wrap", variants:[{label:"Signature",price:199},{label:"Peppery",price:199},{label:"Tandoori",price:199},{label:"Nashville",price:219}], tags:[] },
      { name:"Falafel Wrap",            category:"Wraps", description:"Crispy falafel wrap", variants:[{label:"Single",price:169}], tags:["Veg"] },
      { name:"Classic French Fries",    category:"French Fries", description:"Golden salted fries", variants:[{label:"Regular",price:109}], tags:[] },
      { name:"Spicy Hot French Fries",  category:"French Fries", description:"Spicy Nashville fries", variants:[{label:"Regular",price:119}], tags:["Spicy"] },
      { name:"Cheesy French Fries",     category:"French Fries", description:"Cheese loaded fries", variants:[{label:"Regular",price:149}], tags:[] },
      { name:"Chicken Loaded Fries",    category:"French Fries", description:"Chicken loaded fries", variants:[{label:"Regular",price:249}], tags:["Bestseller"] },
    ];
    const result = await MenuItem.insertMany(items);
    res.json({ message: `Seeded ${result.length} menu items` });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

export default router;