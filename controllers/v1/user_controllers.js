const pool = require("../../config/pool")
const { success, failure, unauthorized } = require("../../utils/response");

module.exports={
    getUsers: async (req, res) => {
        try {

            const [result] = await pool.query(
                "SELECT * FROM users WHERE isActive = 1"
            );

            if (!result || result.length === 0) {
                return success(
                    res,
                    "No data found",
                    []
                );
            }

            return success(
                res,
                "Users fetched successfully",
                result
            );

        } catch (err) {

            console.log("ERROR:", err);

            return failure(
                res,
                "Error while finding users",
                err.message
            );
        }
    },


    loginUser: async (req, res) => {
        try {

            const { email, password } = req.body;

            if (!email || !password) {
                return validationFailed(
                    res,
                    "Email and Password are required",
                    {}
                );
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
                [email]
            );

            if (users.length === 0) {
                return unauthorized(
                    res,
                    "User not found",
                    {}
                );
            }

            const user = users[0];


            if (user.password !== password) {
                return unauthorized(
                    res,
                    "Invalid password",
                    {}
                );
            }

            return success(
                res,
                "Login successful",
                {
                    userId: user.userId,
                    email: user.email,
                    role: user.role
                }
            );

        } catch (err) {

            console.log("LOGIN ERROR:", err);

            return failure(
                res,
                "Error while logging in",
                err.message
            );
        }
    }
}