/////////////////////
// DEPENDENCIES
/////////////////////
// import express
const express = require("express");
// create app object
const app = express();
// get .env variables
require('dotenv').config(); //require before PORT ref
// pull PORT and MONGODB_URL, default PORT value to 4000
const { PORT = 4000, MONGODB_URL } = process.env;
// import mongoose
const mongoose = require("mongoose");
// import middleware
const cors = require('cors');
const morgan = require('morgan');
const { reset } = require("nodemon");

/////////////////////
//DATABASE
/////////////////////
// connect to MongoDB
mongoose.connect(MONGODB_URL);

// mongo status listeners
mongoose.connection
    .on("open", () => console.log("You are connected to mongoose"))
    .on("close", () => console.log("You are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

/////////////////////
// MODELS
/////////////////////
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
});

const People = mongoose.model("People", PeopleSchema);

/////////////////////
// MIDDLEWARE
/////////////////////
app.use(cors()); // prevents CORS errors, opens access to all origins // Access-Control-Allow: *
app.use(morgan("dev")); //logging
app.use(express.json()); // parse json bodies, creates req.body from input
// app.use(express.urlendcoded({ extended: false })) <- creates req.body only when express is serving HTML

/////////////////////
// ROUTES
/////////////////////

// test route
app.get("/", (req, res)=>{
    res.send("hello world");
});

// PEOPLE INDEX ROUTE
app.get("/people", async (req, res) => {
    try {
        const people = await People.find({})
        res.send(people);
        // send all people
        // res.json(await People.find({}));
    } catch (error) {
        console.log('error: ', error);
        res.send({error: 'something went wrong - check console'});
        // send error
        // res.status(400).json(error);
    }
});

// PEOPLE CREATE ROUTE
app.post("/people", async (req, res) => {
    try {
        const person = await People.create(req.body);
        res.send(person)
        // send all people
        // res.json(await People.create(req.body));
    } catch (error) {
        console.log('error: ', error);
        res.send({error: 'something went wrong - check console'});
        // send error
        // res.status(400).json(error);
    }
});

// PEOPLE DELETE ROUTE
app.delete("/people/:id", async (req, res) => {
    try {
        const deletedPerson = await People.findByIdAndRemove(req.params.id);
        res.send(deletedPerson);
    } catch (error) {
        console.log('error: ', error);
        res.send({error: 'something went wrong - check console'});
    }
});

// PEOPLE UPDATE ROUTE
app.put("/people/:id", async (req, res) => {
    try {
        const updatedPerson = await People.findByIdAndUpdate(req.params.id, req.body, { new: true } /* <- sends updated version, otherwise defaults to true*/);
        res.send(updatedPerson);
    } catch (error) {
        console.log('error: ', error);
        res.send({error: 'something went wrong - check console'});
    }
})

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));