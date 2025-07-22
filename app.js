
const express = require("express");
const bodyParser = require("body-parser");
let app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://danrose200:ipcGUoPi2LCBkGqA@test-todo-db.zifmtcq.mongodb.net/?retryWrites=true&w=majority&appName=test-todo-db");//database name todo
const trySchema = new mongoose.Schema({
    name: String,
    priority: {
        type: String,
        enum: ["High", "Mid", "Low"],
        default: "Mid"
    }
});
const item = mongoose.model("task", trySchema) //collection,SchemaName



app.get("/", async function (req, res) {
    try {
        let filter = {};
        let priority = req.query.priority;
        if (priority) {
            filter.priority = priority;
        }
        const foundItems = await item.find(filter);
        res.render("list", { dayej: foundItems, priority: priority });
    } catch (err) {
        console.error("Find error:", err);
        res.send("Error occurred while fetching data.");
    }
});



app.post("/", async function (req, res) {
    const itemName = req.body.ele1;
    const priority = req.body.priority || "Mid";
    const todo = new item({
        name: itemName,
        priority: priority
    });
    try {
        await todo.save();
        res.redirect("/");
    } catch (err) {
        console.error("Save error:", err);
        res.send("Error occurred while saving data.");
    }
});



app.post("/delete", async function (req, res) {
    const checkedItemId = req.body.checkedbox;
    try {
        await item.findByIdAndDelete(checkedItemId);
        res.redirect("/");
    } catch (err) {
        console.error("Delete error:", err);
        res.send("Error occurred while deleting item. " + err);
    }
});


app.get("/edit/:id", async function (req, res) {
    try {
        const foundItem = await item.findById(req.params.id);
        res.render("edit", { item: foundItem });
    } catch (err) {
        res.send("Error occurred while loading edit page. " + err);
    }
});

app.post("/edit/:id", async function (req, res) {
    const itemId = req.body.itemId;
    const updatedName = req.body.updateItems;
    const updatedPriority = req.body.priority || "Mid";
    try {
        await item.findByIdAndUpdate(itemId, { name: updatedName, priority: updatedPriority });
        res.redirect("/");
    } catch (err) {
        res.send("Error occurred while editing item. " + err);
    }
});


app.listen(3000, function () {
    console.log("Server started");
});
