const config = require("../../constants/constants");
const pool = require("../../config/pool");
const bcrypt = require("bcrypt");
// const convertUTCtoIST = require('../../utils/helperfunction/convertUTCtoIST')
const {
  success,
  failure,
  unauthorized,
  validationFailed,
} = require("../../utils/response");
const { convertUTCtoIST } = require("../../utils/helperfunction");

module.exports = {
  getUsers: async (req, res) => {
    try {
      const [result] = await pool.query(
        "SELECT * FROM users WHERE isActive = 1",
      );

      if (!result || result.length === 0) {
        return success(res, "No data found", []);
      }
      // result[0].createdAt = convertUTCtoIST(result[0].createdAt);
      result.map((item)=>{
        item.createdAt = convertUTCtoIST(item.createdAt);
        item.modifiedAt = convertUTCtoIST(item.modifiedAt);
      })
      return success(res, "Users fetched successfully", result);
    } catch (err) {
      console.log("ERROR:", err);

      return failure(res, "Error while finding users", err.message);
    }
  },

  addUser: async (req, res) => {
    const { fullName, mobile, email, password } = req.body;
    if (!email || !password || !mobile || !fullName) {
      return validationFailed(
        res,
        "FullName, Mobile, Email and Password are required",
        {},
      );
    }
    try {
      const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);
      const [result] = await pool.query(
        `INSERT INTO users(fullName, mobileNo, email,password) VALUES (?,?,?,?)`,
        [fullName, mobile, email, hashedPassword],
      );
      return success(res, "User Created Successfully", result);
    } catch (err) {
      console.log("LOGIN ERROR:", err);

      return failure(res, "Error while Sign up", err.message);
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return validationFailed(res, "Email and Password are required", {});
      }

      const [users] = await pool.query(
        `
                SELECT
                    userId,
                    fullName,
                    email,
                    mobileNo,
                    password,
                    role,
                    isActive
                FROM users
                WHERE email = ? and isActive = 1
                `,
        [email],
      );

      const user = users[0];

      if (user) {
        const hashedPassword = user.password;
        const status = await bcrypt.compare(password, hashedPassword);
        if (status) {
          const res_user = {
            uid: user.userId,
            email: user.email,
          };
          return success(res, "Login successful", {
            userId: user.userId,
            email: user.email,
            role: user.role,
          });
        }else {
        return unauthorized(res, "Invalid password", {});
      }
      }else {
        return unauthorized(res, "Invalid email", {});
      }

    } catch (err) {
      console.log("LOGIN ERROR:", err);

      return failure(res, "Error while logging in", err.message);
    }
  },

  // Only Admin acccess.
  changeRole: async (req, res) => {
    const {role, email} = req.body;
    try{
      const result = await pool.query(
        `UPDATE users SET role=? WHERE email=? AND isActive=1`,
        [role, email]
      )

      if(result[0].affectedRows == 0){
        return unauthorized(res, "User not found", {});
      }else{
        return success(res, "User Role updated successfully", result);
      }

    }catch(e){
      return failure(res, e.sql, e.message);
    }
  }
};
