const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/lab_inventory", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongo Connected");
  });

// Models
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, enum: ["student", "admin"], default: "student" },
  })
);

const Item = mongoose.model(
  "Item",
  new mongoose.Schema({
    name: String,
    totalQuantity: Number,
    availableQuantity: Number,
  })
);

const Request = mongoose.model(
  "Request",
  new mongoose.Schema({
    studentId: mongoose.Types.ObjectId,
    itemId: mongoose.Types.ObjectId,
    status: {
      type: String,
      enum: ["pending", "issued", "out of stock"],
      default: "pending",
    },
    requestedAt: { type: Date, default: Date.now },
  })
);

// Routes
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find({ totalQuantity: { $gt: 0 } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
});

app.post("/api/request", async (req, res) => {
  const { studentId, itemId } = req.body;
  const item = await Item.findById(itemId);
  const request = new Request({ studentId, itemId });

  if (item.availableQuantity == 0) {
    request.status = "out of stock";
  }
  item.availableQuantity--;
  await item.save();

  await request.save();

  res.json(request);
});

app.post("/api/issue/:requestId", async (req, res) => {
  const request = await Request.findById(req.params.requestId);

  if (request.status === "pending") {
    request.status = "issued";
    await request.save();
    return res.json({ message: "Item issued successfully" });
  }

  res.status(400).json({ message: "Item not ready to be issued" });
});

app.get("/api/queue/:itemId", async (req, res) => {
  const queue = await Request.find({
    itemId: req.params.itemId,
    status: "pending",
  }).sort("requestedAt");
  res.json(queue);
});
app.get("/api/requests", async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("itemId", "name")
      .populate("studentId", "name email")
      .sort({ requestedAt: -1 });

    const formatted = requests.map((r) => ({
      _id: r._id,
      itemName: r.itemId?.name,
      studentName: r.studentId?.name,
      studentEmail: r.studentId?.email,
      status: r.status,
      requestedAt: r.requestedAt,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests", error });
  }
});

app.post("/api/users/createUser", async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = new User({ name, email, password, role });
  await user.save();

  res.json({ message: "User created", user });
});
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.password !== password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", user });
});
// GET /api/students/requests?studentId=YOUR_ID
app.get("/api/students/requests", async (req, res) => {
  try {
    const { studentId } = req.query;
    const filter = studentId ? { studentId } : {};

    const requests = await Request.find(filter).sort({ requestedAt: -1 }); // Most recent requests first

    // Extract unique itemIds
    const itemIds = [...new Set(requests.map((r) => r.itemId.toString()))];

    // Fetch item details
    const items = await Item.find({ _id: { $in: itemIds } });

    // Map itemId to its most recent request status
    const itemStatusMap = {};
    requests.forEach((req) => {
      const idStr = req.itemId.toString();
      if (!itemStatusMap[idStr]) {
        itemStatusMap[idStr] = req.status;
      }
    });

    // Combine item details with status
    const itemsWithStatus = requests.map((req) => {
      const item = items.find(
        (i) => i._id.toString() === req.itemId.toString()
      );
      return {
        ...item?.toObject(),
        status: req.status,
        requestedAt: req.requestedAt,
      };
    });

    res.json({
      requestedItemCount: itemsWithStatus.length,
      items: itemsWithStatus,
      requests,
    });
  } catch (err) {
    console.error("Error fetching requested items:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
// POST /api/items/add
app.post("/api/items/add", async (req, res) => {
  const { name, totalQuantity } = req.body;

  if (!name || !totalQuantity) {
    return res.status(400).json({ message: "Name and totalQuantity required" });
  }

  const newItem = new Item({
    name,
    totalQuantity,
    availableQuantity: totalQuantity,
  });

  try {
    await newItem.save();
    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to add item", error });
  }
});
// PUT /api/items/update/:itemId
app.put("/api/items/update/:itemId", async (req, res) => {
  const { availableQuantity } = req.body;
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.itemId,
      { availableQuantity },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item updated", item });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
});

app.listen(5000, () => console.log("Server started on port 5000"));
