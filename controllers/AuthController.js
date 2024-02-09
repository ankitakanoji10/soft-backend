const User = require('../models/User');
 const loginController = async (req, res) => {
    try {
        console.log(req);
        const { name, email} = req.body;
        if (!name)
        {
            return res.send({ message: "Name is required" });
        }
        if (!email)
        {
            return res.send({ message: "email is required" });
        }
       
        const existinguser = await User.findOne({ email });
        if (existinguser)
        {
            return res.status(200).send({
                success: false,
                message: "user already exists", 
                existinguser
            })
        }
       
        const user = await new User({ name, email }).save();
        res.status(201).send({
            success: true,
            message: "user registered successfully",
            user
        })

        
    } catch (error) {
        console.log("idhar error hai");
        console.log(error);
        res.status(500).send({
            success: false,
            message:"Error in registration"
        })
    }

}
module.exports = {
    loginController,
};