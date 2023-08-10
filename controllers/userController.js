const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")






const registerUser = asyncHandler(async (req, res) =>{
    const {username, email, password} = req.body
    if (!username || !email || !password)
    {
        res.status(400)
        throw new Error("All fieds are mandatory")
    }

    const userAvailable = await User.findOne({email})
    if(userAvailable){
        res.status(400)
        throw new Error("Email already exist, register with a  new email")
    }

    const hashPassword = await bcrypt.hash(password, 10)
    //console.log("Hash password:", hashPassword)
    const user = await User.create({
        username,
        email,
        password: hashPassword
    })
    console.log(`User created ${user}`)
    if(user)
    {
        res.status(201).json({_id:user.id, email: user.email})
    }else{
        throw new Error("User data is not valid")
    }
    res.json({message: "Register the User"})
})


const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400);
            throw new Error("All fields are mandatory");
        }
        
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const accessToken = jwt.sign({
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id
                }
            }, 
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" } // Set token expiration to 1 hour
            );
            res.status(200).json({ accessToken });
        } else {
            res.status(401);
            throw new Error("Email or password is not correct");
        }
    } catch (error) {
        res.status(500); // Internal Server Error
        throw error; // Rethrow the error for central error handling
    }
});



const currentUser = asyncHandler(async (req, res) =>{
    res.json(req.user)
})





module.exports = {registerUser,loginUser,currentUser}