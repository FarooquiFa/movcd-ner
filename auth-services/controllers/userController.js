const bcrypt = require('bcrypt');
const { pool } = require('../config/database');
const jwtGenerator = require('../utils/jwtGenerator');

const register = async (req, res) => {
  const { email, password, firstname, lastname, role } = req.body;

  try {
    const id = (Math.random() * 100000000) | 0;
    const userQuery = `SELECT * FROM public.users WHERE email = $1`;

    pool.query(userQuery, [email], async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (result.rows.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = `
          INSERT INTO public.users (id, firstname, lastname, email, password, role)
          VALUES ($1, $2, $3, $4, $5, $6)
        `;
        pool.query(insertQuery, [id, firstname, lastname, email, hashedPassword, role], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Error inserting user into database' });
          }
          const tokens = jwtGenerator(email);
          return res.status(201).json({ message: 'User created successfully', tokens });
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error hashing password' });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const selectQuery = `SELECT * FROM public.users WHERE email = $1`;
  pool.query(selectQuery, [email], async (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    try {
      const hashedPassword = result.rows[0].password;
      const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
      const userDetails = result.rows[0];

      if (isPasswordMatch) {
        const tokens = jwtGenerator(email);
        return res.status(200).json({ message: 'Login successful', tokens, userDetails });
      } else {
        return res.status(401).json({ error: 'Incorrect password' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error comparing passwords' });
    }
  });
};

module.exports = { register, login };
