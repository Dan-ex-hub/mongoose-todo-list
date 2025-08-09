const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");

let app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride("_method"));

const mongoose = require("mongoose");
const MONGO = process.env.MONGO || "mongodb+srv://danrose200:ipcGUoPi2LCBkGqA@test-todo-db.zifmtcq.mongodb.net/?retryWrites=true&w=majority&appName=test-todo-db";
mongoose.connect(MONGO);

const trySchema = new mongoose.Schema({
    name: String,
    priority: {
        type: String,
        enum: ["Urgent", "High", "Low"],
    }
});
const item = mongoose.model("tasks", trySchema);

app.get("/", async function (req, res) {
    try {
        let filter = {};
        let priority = req.query.priority;
        if (priority) {
            filter.priority = priority;
        }
        const founditem = await item.find(filter);
        res.render("list", { dayej: founditem, priority: priority });
    } catch (err) {
        console.error("Find error:", err);
    }
});

app.post("/", async function (req, res) {
    const todo = new item({
        name: req.body.ele1,
        priority: req.body.priority
    });
    try {
        await todo.save();
         res.redirect("/");
    } catch (err) {
        res.send("Error occurred while creating item. " + err);
    }
});

app.delete("/delete/:id", async function (req, res) {
    try {
        await item.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (err) {
        res.send("Error occurred while deleting item. " + err);
    }
});

app.get("/edit/:id", async function (req, res) {
    try {
        const founditem = await item.findById(req.params.id);
        res.render("edit", { item: founditem });
    } catch (err) {
        res.send("Error occurred while loading edit page. " + err);
    }
});

app.put("/edit/:id", async function (req, res) {
    try {
        await item.findByIdAndUpdate(req.params.id, { 
            name: req.body.updateitems, 
            priority: req.body.priority 
        });
        res.redirect("/");
    } catch (err) {
        res.send("Error occurred while editing item. " + err);
    }
});

app.listen(5000, function () {
    console.log("Server started");
});
