const Product = require('../models/product');
const Cart = require('../models/cart');

const getProducts = (req, res, next) => {
    Product.findAll()
    .then((products) => {
        res.render('shop/product-list',{
            prods:products,
            pageTitle:'All Products',
            path:'/products'
        });
    })
    .catch(err => console.log(err)); 
};

const getProduct = (req,res, next) => {
    const prodId = req.params.productId;
    Product.findAll({where: {id: prodId} })
    .then( products => {
        res.render('shop/product-detail', {
            product:products[0], 
            pageTitle:products[0].title, // for which title would be active
            path:'/products' // For Which class would be active 
        });   
    }).catch(err => console.log(err));
};

const getIndex = (req, res, next) => {
    Product.findAll()
    .then((products) => {
        res.render('shop/index',{
            prods:products,
            pageTitle:'shop',
            path:'/'
        });
    })
    .catch(err => console.log(err)); 
};

const getCart = (req, res,  next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products){
                const cartProductData = cart.products.find(
                    prod => prod.id === product.id
                );
                if (cartProductData){
                    cartProducts.push({productData: product, qty: cartProductData.qty})
                }
            };
            res.render('shop/cart',{
                path: 'cart',
                pageTitle: 'Your Cart',
                products:cartProducts
            });
        });
    });
};

const postCart = (req,res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
}

const postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    })
}

const getOrders = (req, res, next) => {
    res.render('shop/orders',{
        path:'/orders',
        pageTitle:'Your Orders'
    });
}; 

const getCheckout = (req, res, next) => {
    res.render('shop/checkout',{
        path:'checkout',
        pageTitle: 'Checkout'
    });
};

module.exports = {
    getProducts,
    getProduct,
    getIndex,
    getCart,
    postCart,
    postCartDeleteProduct,
    getOrders,
    getCheckout
} 