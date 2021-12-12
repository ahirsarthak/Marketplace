const express = require('express');
const { cart } = require('../data');
const router = express.Router();
const data = require('../data');
const cartData = data.cart;

router.get("/", async (req,res) => {
    try{
    let id = req.session.user
    const cartResult = await cartData.getUserCart(id)
    res.render('posts/cartPage',{
        products : cartResult.products,
        totalPrice : cartResult.totalPrice,
        title : 'Cart Page'
    })}
    catch(e){
        res.render('posts/cartPage',{ error : e})
}
})

router.get("/addToCart/:id", async (req,res) =>{
    try{let userId = req.session.user
    let prodId = req.params.id
    validateId(prodId)
    const addedToCart = await cartData.addToCart(userId,prodId)
    res.redirect("/product/exploreproduct")}
    catch(e){
        if(e[0] == 405){
            res.status(e[0]).render('posts/error',{error : e[1] , status: e[0]})
        }
        else{
            res.render('posts/cartPage',{ error : e})
        }
    }
})

router.get("/removeProduct/:id", async (req,res) =>{
   try {let userId = req.session.user
    let prodId = req.params.id
    validateId(prodId)
    const removeProduct = await cartData.removeFromCart(userId,prodId)
    res.redirect("/cart/")}
    catch(e){
        if(e[0] == 405){
            res.status(e[0]).render('posts/error',{error : e[1] , status: e[0]})
        }
        else{
            res.render('posts/cartPage',{ error : e})
        }
    }
})

router.post("/purchase",async (req,res) =>{
    let userId = req.session.user
    let order = await cartData.placeOrder(userId)
    res.redirect("/")
})

router.get("/orderHistory", async (req,res) =>{
    let userId = req.session.user
    let orders = await cartData.fetchOrders(userId)
    res.render('posts/orderHistory',{orders:orders})
})

router.get("/orderDetails/:id", async (req,res) =>{
    try{let id = req.params.id
    validateId(prodId)
    const cartResult = await cartData.getOrder(id)
    res.render('posts/orderDetails',{
        products : cartResult.products,
        totalPrice : cartResult.totalPrice,
        title : 'Order Details Page'
    })}
    catch(e){
        res.status(e[0]).render('posts/error',{error : e[1] , status: e[0]})
    }
})

function validateId(id){
    if(typeof id !== "string") throw [405,"invalid ID"]
    if (!id || id.trim().length ==0) throw [405,"invalid ID"]
    if(!/^[0-9A-Fa-f]{24}$/.test(id)) throw [405,"invalid ID"]
  }

module.exports = router;