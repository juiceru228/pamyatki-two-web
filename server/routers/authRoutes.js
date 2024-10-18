const express = require("express");
const validateForm = require("../controllers/validateForm");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user && req.session.user.username) {
      res.json({ loggedIn: true, username: req.session.user.username });
    } else {
      res.json({ loggedIn: false });
    }
  })
  .post(async (req, res) => {
    validateForm(req, res);

    const potentialLogin = await pool.query(
      "SELECT id, username, passhash FROM users u WHERE u.username=$1",
      [req.body.username]
    );

    if (potentialLogin.rowCount > 0) {
      const isSamePass = await bcrypt.compare(
        req.body.password,
        potentialLogin.rows[0].passhash
      );
      if (isSamePass) {
        req.session.user = {
          username: req.body.username,
          id: potentialLogin.rows[0].id,
        };
        res.json({ loggedIn: true, username: req.body.username });
      } else {
        res.json({ loggedIn: false, status: "Wrong username or password!" });
        //console.log("not good");
      }
    } else {
      //console.log("not good");
      res.json({ loggedIn: false, status: "Wrong username or password!" });
    }
  });

router.post("/signup", async (req, res) => {
  validateForm(req, res);

  const existingUser = await pool.query(
    "SELECT username from users WHERE username=$1",
    [req.body.username]
  );

  if (existingUser.rowCount === 0) {
    // register
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newUserQuery = await pool.query(
      "INSERT INTO users(username, passhash) values($1,$2) RETURNING id, username",
      [req.body.username, hashedPass]
    );
    
    req.session.user = {
      username: req.body.username,
      id: newUserQuery.rows[0].id,
    };

    res.json({ loggedIn: true, username: req.body.username });
  } else {
    res.json({ loggedIn: false, status: "Username taken" });
  }
});

router.get("/me", (req, res) => {
  if (req.session.user) {
    pool.query('SELECT avatar_url FROM users WHERE id = \$1', [req.session.user.id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      const userWithAvatar = {
        ...req.session.user,
        avatarUrl: result.rows[0].avatar_url 
      };
      res.json({ loggedIn: true, user: userWithAvatar });
    });
  } else {
    res.json({ loggedIn: false });
  }
});

router.get("/logout", (req, res) => {
  if (req.session.user) {
    req.session.user = null;
    res.json({ loggedIn: false});
  } else {
    res.json({ loggedIn: false});
  }
});

router.post("/changepassword", async (req, res) => { 
  const { currentPassword, newPassword } = req.body; 

  // ValidateForm:
  const formData = req.body; 
  const validationErrors = validateForm(formData);

  if (validationErrors.length > 0) {
    return res.status(422).json({ 
      status: "Неверный формат данных", 
      errors: validationErrors 
    }); 
  }

  try {
    // Получить текущего пользователя из базы данных
    const user = await pool.query(
      "SELECT id, username, passhash FROM users u WHERE u.username=$1",
      [req.session.user.username]
    );

    // Проверить текущий пароль
    const isSamePass = await bcrypt.compare(currentPassword, user.rows[0].passhash);
  
    if (!isSamePass) {
      return res.status(401).json({
        status: "Неверный текущий пароль",
      }); 
    }

    // Хешировать новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Изменить пароль в базе данных
    await pool.query(
      "UPDATE users SET passhash = $1 WHERE id = $2",
      [hashedPassword, req.session.user.id]
    );

    // Обновить сессию пользователя
    req.session.user = {
      ...req.session.user,
      passhash: hashedPassword,
    };

    res.json({ status: "Success" }); 
  } catch (error) {
    //console.error(error);
    res.status(500).json({
      status: "Ошибка при смене пароля. Попробуйте позже.",
    });
  }
});




module.exports = router;