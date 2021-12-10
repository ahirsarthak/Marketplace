const express = require('express');
const { cart } = require('../data');
const router = express.Router();
const data = require('../data');
const cartData = data.cart;

router.get("/", async (req,res) => {
    let id = req.session.user
    const cartResult = await cartData.getUserCart(id)
    res.render('posts/cartPage',{
        products : cartResult.products,
        totalPrice : cartResult.totalPrice,
        title : 'Cart Page'
    })
})

router.get("/addToCart/:id", async (req,res) =>{
    let userId = req.session.user
    let prodId = req.params.id
    const addedToCart = await cartData.addToCart(userId,prodId)
    res.redirect("/product/exploreproduct")
})

router.get("/removeProduct/:id", async (req,res) =>{
    let userId = req.session.user
    let prodId = req.params.id
    const removeProduct = await cartData.removeFromCart(userId,prodId)
    res.redirect("/cart/")
})

router.post("/purchase",async (req,res) =>{
    let userId = req.session.user
    let order = await cartData.placeOrder(userId)
    res.redirect("/")
})

router.get("/orderHistory", async (req,res) =>{
    let userId = req.session.user
    let orders = await fetchOrders(userId)
    res.render('posts/orderHistory',{orders:orders})
})



module.exports = router;