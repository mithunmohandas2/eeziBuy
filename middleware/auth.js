
const isLogin = async (req, res, next) => {
    try {
       // console.log("is Login" + req.session.user_name)  
        if (req.session.user_name) {
            
        } else {
            res.clearCookie();
           return res.redirect('/')
        }
        return next();
    } catch (error) {
        console.log(error.message)
    }
}

const isLogout = async (req, res, next) => {
    try {
        // console.log("is Logout" + req.session.user_name)
        if (req.session.user_name) {
            return res.redirect('/home')
        }
        return next();
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    isLogin,
    isLogout
}