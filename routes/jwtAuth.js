const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { pool: pool, poolUser } = require("../db");
const validInfo = require("../middleware/validinfo");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middleware/authorize");
const path = require("path");
const fs = require("fs");



const validinfo = require("../middleware/validinfo");

function arrayConverter(a) {
  let array = "ARRAY[";
  a.forEach((element) => {
    if (a.indexOf(element) != a.length - 1) {
      array += "'" + element + "',";
    } else {
      array += "'" + element + "']";
    }
  });
  return array;
}

router.post("/signup", validInfo, async (req, res) => {
    console.log("hit")
    let email = req.body.email;  
    let password = req.body.password; 
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let role = req.body.role;
  
    try {
      let id = (Math.random() * 100000000) | 0;
      id = id.toString().length < 8 ? id + "0".repeat(8 - id.toString().length) : id;
      let loginTimestamp = (Date.now() / 1000).toFixed();
      let userQuery = `SELECT * FROM public.users WHERE email ='${email}'`;
      
      poolUser.query(userQuery, async (err, result) => {
        console.log(userQuery, "__userdetails");
        console.log("i m here inside ");
  
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Internal server error" });
        } else {
   
            try {
              const hashedPassword = await bcrypt.hash(password, 10); 
              console.log({ hash: hashedPassword });
  
              let insertQuery = `
              INSERT INTO public.users
              (id, firstname, lastname, email, "password","role")
              VALUES(${id}, '${firstname}', '${lastname}', '${email}', '${hashedPassword}','${role}')`;
  
              poolUser.query(insertQuery, (err, result) => {
                if (err) {
                  console.log(err);
                  res.status(500).json({ error: "Error inserting user into database" });
                } else {
                  const tokens = jwtGenerator(email); // Assuming email is the unique identifier
                  res.status(201).json({ message: "User created successfully", tokens });
                }
              });
            } catch (error) {
              console.log(error);
              res.status(500).json({ error: "Error hashing password" });
            }
          
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  
  router.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    console.log("hittif")
  
    let selectQuery = `SELECT * FROM public.users WHERE email='${email}'`;
    poolUser.query(selectQuery, async (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        if (result.rows.length === 0) {
          res.status(404).json({ error: "User not found" });
        } else {
          try {
            const hashedPassword = result.rows[0].password;
            const isPasswordMatch = await bcrypt.compare(
              password,
              hashedPassword
            );
            let finalObj = result.rows[0];
            if (isPasswordMatch) {
              const userDetails = { ...finalObj };
            //   const jwtToken = jwtGenerator(finalObj.id);
              console.log("Password matches");
              // Here you can implement the logic for successful login
              const tokens = jwtGenerator(email); // Assuming email is the unique identifier
              res.status(201).json({ message: "User created successfully", tokens,     userDetails });
         
            } else {
              console.log("Password does not match");
              res.status(401).json({ error: "Incorrect password" });
            }
          } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error comparing passwords" });
          }
        }
      }
    });
  });

  module.exports=router