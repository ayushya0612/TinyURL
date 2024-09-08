const express = require("express");
const URL = require("./models/url");
const path = require("path");

const {connectMongoDB} = require("./connection");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter.js");


const app = express();
const port = 3000;

// MongoDB connection
connectMongoDB("mongodb://127.0.0.1:27017/short-url").then(()=>{
    console.log("MongoDB is connected");
})

// ejs declaration
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/url", urlRoute); // ok

app.use("/", staticRoute);  // ok


app.get("/url/:shortId", async (req, res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortID: shortId,
    }, 
    {   $push:{
            visitHistory: {
                timestamp: Date.now()
            },
        },
    },
       
);

    return res.redirect(entry.redirectURL);    // "https://" + -> for postman purpose
})

app.listen(port, ()=>{
    console.log(`Server started at port: ${port}`);
})