import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ===== Регистрация пользователя =====
export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Проверяем, есть ли уже пользователь
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем нового пользователя
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({ 
      message: "User registered successfully", 
      userId: user._id 
    });
  } catch (err) {
    next(err); // передаем ошибку в error middleware
  }
};

// ===== Логин пользователя =====
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Проверяем пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Проверяем пароль
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Создаем JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // токен действителен 1 день
    );

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
    });
  } catch (err) {
    next(err); // передаем ошибку в error middleware
  }
};
