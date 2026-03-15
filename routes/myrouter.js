const express = require("express");
const router = express.Router();
const User = require("../models/members");
const Product = require("../models/products");
const Member = require("../models/members");
const Sale = require("../models/sales");
const Promotion = require("../models/promotions");
const Payment = require("../models/payment");

const bcrypt = require("bcryptjs");

const multer = require("multer");

async function createOwner() {
  try {
    const ownerEmail = "owner@gmail.com";

    const existingOwner = await Member.findOne({ email: ownerEmail });

    if (!existingOwner) {
      const hashedPassword = await bcrypt.hash("123456", 10);

      const owner = new Member({
        name: "Owner",
        email: ownerEmail,
        phone: "0000000000",
        password: hashedPassword,
        role: "owner",
      });

      await owner.save();

      console.log("Owner created");
    }
  } catch (err) {
    console.log("Owner create error:", err);
  }
}

createOwner();

/* ==============================
   Multer Upload
============================== */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg");
  },
});

const upload = multer({ storage: storage });

/* ==============================
   REGISTER
============================== */

router.get("/register", (req, res) => {
  res.render("register/regisindex");
});

router.post("/register", async (req, res) => {
  const { name, email, phone, password, confirmPassword, role } = req.body;

  if (password !== confirmPassword) {
    return res.render("register/registindex", {
      error: "Password not match",
      data: req.body,
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    phone,
    password: hash,
    role,
  });

  await user.save();

  res.redirect("/login");
});
/* ==============================
   LOGIN
============================== */

router.get("/login", (req, res) => {
  res.render("login", { message: req.session.message });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await Member.findOne({ email: email });

  if (!user) {
    return res.redirect("/login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.redirect("/login");
  }

  // สร้าง session
  req.session.user = {
    name: user.firstname,
    role: user.role,
    id: user._id,
  };

  // redirect ตาม role
  if (user.role === "owner") {
    return res.redirect("/dashboard");
  }

  if (user.role === "employee") {
    return res.redirect("/dashboard");
  }

  if (user.role === "customer") {
    return res.redirect("/dashboard");
  }
});

/* ==============================
   DASHBOARD
============================== */

router.get("/owner/dashboard", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "owner") {
    return res.send("Access Denied");
  }

  const totalSales = await Sale.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  const revenue = totalSales[0]?.totalRevenue || 0;
  const orders = totalSales[0]?.totalOrders || 0;

  res.render("dashboard", {
    user: req.session.user,
    revenue,
    orders,
  });
});

router.get("/employee/dashboard", (req, res) => {
  if (!req.session.user || req.session.user.role !== "employee") {
    return res.send("Access Denied");
  }

  res.render("dashboard", { user: req.session.user });
});

router.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user.role === "owner") {
    return res.redirect("/owner/dashboard");
  }

  if (req.session.user.role === "employee") {
    return res.redirect("/employee/dashboard");
  }

  res.redirect("/");
});

/* ==============================
   LOGOUT
============================== */

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

/* ==============================
   MEMBERS (OWNER ONLY)
============================== */

router.get("/members", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "owner") {
    return res.send("Access Denied");
  }

  const members = await Member.find();

  res.render("manageMembers", { members });
});

router.get("/members/delete/:id", async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);

  res.redirect("/members");
});

router.get("/members/edit/:id", async (req, res) => {
  const member = await Member.findById(req.params.id);

  res.render("editMember", { member });
});

router.post("/members/update", async (req, res) => {
  const { id, name, email, phone } = req.body;

  await Member.findByIdAndUpdate(id, { name, email, phone });

  res.redirect("/members");
});

/* ==============================
   PROMOTION
============================== */

router.get("/promotion", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "owner") {
    return res.send("Access Denied");
  }

  const promotions = await Promotion.find();

  res.render("promotion", {
    user: req.session.user,
    promotions: promotions,
  });
});

router.post("/promotion/create", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "owner") {
    return res.send("Access Denied");
  }

  const { name, discount, description } = req.body;

  const newPromotion = new Promotion({
    name,
    discount,
    description,
  });

  await newPromotion.save();

  res.redirect("/promotion");
});

router.get("/promotion/delete/:id", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "owner") {
    return res.send("Access Denied");
  }

  await Promotion.findByIdAndDelete(req.params.id);

  res.redirect("/promotion");
});
/* ==============================
   PAYMENT METHOD
============================== */

router.get("/payment", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "owner") {
    return res.send("Access Denied");
  }

  const payments = await Payment.find();

  res.render("payment", { payments });
});

router.post("/payment/create", async (req, res) => {
  try {
    const payment = new Payment({
      name: req.body.name,
    });
    await payment.save();

    // กลับไปหน้าเดิมเพื่อให้ผู้ใช้เห็นรายการที่เพิ่งเพิ่มเข้าไป
    res.redirect("/payment");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating payment method");
  }
});

router.get("/payment/delete/:id", async (req, res) => {
  await Payment.findByIdAndDelete(req.params.id);

  res.redirect("/payment");
});
router.post("/checkout", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const { productId, paymentMethod } = req.body;

  const product = await Product.findById(productId);

  const newSale = new Sale({
    product: product._id,
    member: req.session.user.id,
    quantity: 1,
    totalPrice: product.price,
  });

  await newSale.save();

  res.send("ชำระเงินสำเร็จ ด้วยวิธี " + paymentMethod);
});
/* ==============================
   SALES REPORT (OWNER ONLY)
============================== */

router.get("/sales/all", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "owner") {
    return res.send("Access Denied");
  }

  const sales = await Sale.find().populate("product").populate("member");

  res.render("sales/showsale", { sales });
});

router.get("/sales/report", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "owner") {
    return res.send("Access Denied");
  }

  const sales = await Sale.find();

  res.render("sales_report", { sales });
});

/* ==============================
   NEW SALE
============================== */

router.get("/sales/new", async (req, res) => {
  const products = await Product.find();

  res.render("sales/newsale", { products });
});

router.post("/sales/insert", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const { product, quantity } = req.body;

  const productData = await Product.findById(product);

  const totalPrice = productData.price * quantity;

  const newSale = new Sale({
    product,
    member: req.session.user._id,
    quantity,
    totalPrice,
  });

  await newSale.save();

  res.redirect("/shop");
});

/* ==============================
   SHOP (CUSTOMER)
============================== */

router.get("/shop", async (req, res) => {
  const products = await Product.find();

  res.render("index", { products });
});

/* ==============================
   PRODUCTS
============================== */

router.get("/", async (req, res) => {
  const products = await Product.find();

  res.render("index", {
    title: "TECHGEN SHOP",
    products,
  });
});

router.get("/addForm", (req, res) => {
  res.render("form", { title: "Add Product" });
});

router.get("/manage", async (req, res) => {
  const products = await Product.find();

  res.render("manage", {
    products: products,
  });
});
router.post("/insert", upload.single("image"), async (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    price: req.body.price,
    image: req.file.filename,
    description: req.body.description,
  });

  await newProduct.save();

  res.redirect("/");
});

router.get("/delete/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);

  res.redirect("/manage");
});

router.get("/product/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  const payments = await Payment.find();

  const promotions = await Promotion.find();

  res.render("product", {
    product,
    payments,
    promotions,
  });
});

router.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);

  res.render("formedit", {
    title: "แก้ไขสินค้า",
    product: product,
  });
});

router.post("/update", upload.single("image"), async (req, res) => {
  const id = req.body.id;

  const data = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
  };

  if (req.file) {
    data.image = req.file.filename;
  }

  await Product.findByIdAndUpdate(id, data);

  res.redirect("/manage");
});

module.exports = router;
