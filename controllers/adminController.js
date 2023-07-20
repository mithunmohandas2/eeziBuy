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

        if (adminMatch) {
            console.log(adminMatch.name + " (admin) logged in")          //
            req.session.user_name = adminMatch.name;
            req.session.admin = true;
            res.cookie('user_name', adminMatch.name);
            res.redirect("/admin/home")
        } else {
            res.render('login', { message: "Invalid Credentials" })
        }

    } catch (error) {
        console.log(error.message)
    }
}


const loadDashboard = async (req, res) => {

    try {
        const all_users = await User.find()
        // console.log(all_users)
        res.render('home', { username: req.session.user_name, users: all_users });
    } catch (error) {
        console.log(error.message)
    }
}



const logout = async (req, res) => {
    try {
        res.clearCookie("user_name");
        console.log(req.session.user_name + " (admin) logged out")          //
        req.session.destroy()
        res.render('login', { message: 'Please login to continue' });
    } catch (error) {
        console.log(error.message)
    }
}

const searchUser = async (req, res) => {

    try {
        const all_users = await User.find()   // find all users

        const startLetter = req.body.search
        const regex = new RegExp(`^${startLetter}`, 'i');
        const search_user = await User.find({ name: { $regex: regex } });   //find user with starting letter

        // console.log(search_user)
        // console.log(all_users)

        res.render('home', {
            username: req.session.user_name,
            users: all_users,
            searchData: search_user
        });

    } catch (error) {
        console.log(error.message)
    }
}

const editUser = async (req, res) => {
        // check password and confirm password is same
        if (req.body.password != req.body.password2) {
            console.log("password mismatch")
            res.redirect('/admin/home')   // popup
        } else {
    
            try {
                // if email or password exist in database
                const emailMatch = await User.findOne({ email: req.body.email })
                const phoneMatch = await User.findOne({ phone: req.body.phone })
                if (emailMatch || phoneMatch) {
                    console.log("Existing user in database")
                    res.redirect('/admin/home')   // popup
    
                } else { // if details not in database
    
                    const user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone,
                        password: req.body.password,
                        admin_status: req.body.admin_status
                    })
    
                    const userData = await user.save();
                    console.log(userData)
                    if (userData) {  // adding to database success?
                        res.redirect('/admin/home')   // popup success
                    } else {
                        res.redirect('/admin/home')   // popup failed
                    }
                }
            } catch (error) {
                console.log(error.message)
            }
        }
    }

   const deleteUser = async (req, res) => {

    try {
        if(req.body.phone) await User.deleteOne({phone: req.body.phone})
        else await User.deleteOne({email: req.body.email})
        res.redirect("/admin")
    } catch (error) {
        console.log(error.message)
    }
}


module.exports = {
    loginLoad,
    verifyLogin,
    loadDashboard,
    logout,
    searchUser,
    editUser,
    deleteUser
}