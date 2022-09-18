module.exports = (req, res, next) => {
    if(!(req.query).s){
        res.redirect("/login")
    }else{
        next();
    }
}