const User = require("../models/userModel");

// -------------------------------------------------
// loading the login page
const loginLoad = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message)
    }
}

const verifyLogin = async (req, res) => {
    try {
        const adminMatch = await User.findOne({ $and: [{ email: req.body.email }, { password: req.body.password }, { admin_status: true }] })

        if(adminMatch){
            console.log(adminMatch.name+" (admin) logged in")          //
            req.session.user_name = adminMatch.name;
            req.session.admin = true;
            res.cookie('user_name', adminMatch.name);
            res.redirect("/admin/home")
        } else {
            res.render('login', {message: "Invalid Credentials"})  
        }

    } catch (error) {
        console.log(error.message)
    }
}


const loadDashboard = async (req, res) => {
    
    try {
        const all_users= await User.find()
        // console.log(all_users)
        res.render('home', { username: req.session.user_name, users: all_users });
    } catch (error) {
        console.log(error.message)
    }
}



const logout = async (req, res) => {
    try {
        res.clearCookie("user_name");
        console.log(req.session.user_name+" (admin) logged out")          //
        req.session.destroy()
        res.render('login', { message: 'Please login to continue' });
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loginLoad,
    verifyLogin,
    loadDashboard,
    logout
}