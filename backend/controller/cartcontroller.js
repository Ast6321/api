const cartdb = require("../model/cartschema");
const productdb = require("../model/productschema");

exports.addToCart = async (req, res) => {
  try {

    const userId = req.user.id;
    const { productId, sku, quantity } = req.body;

    
    if (!productId || !sku || !quantity) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

   
    const product = await productdb.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    const variant = product.variants.find(v => v.sku === sku);

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

  
    let cart = await cartdb.findOne({ userId });

    if (!cart) {
      cart = new cartdb({
        userId,
        items: []
      });
    }

    
    const itemIndex = cart.items.findIndex(
      item =>
        item.productId.toString() === productId.toString() &&
        item.sku === sku
    );

    if (itemIndex > -1) {
     
      cart.items[itemIndex].quantity += quantity;
    } else {
      
      cart.items.push({
        productId,
        sku,
        color: variant.color,
        size: variant.size,
        quantity,
        price: variant.price,      
        name: product.name,        
        image: product.images[0]?.url || null
      });
    }

    await cart.save();

    return res.status(200).json({
      message: "Item added to cart",
      cart
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};



exports.getCart = async (req, res) => {
  try {

    const userId = req.user.id;

    const cart = await cartdb.findOne({ userId });

    
    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        message: "cart is empty",
        items: [],
        totalItems: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0
      });
    }

    let totalItems = 0;
    let subtotal = 0;

   
    cart.items.forEach(item => {
      totalItems += item.quantity;
      subtotal += item.quantity * item.price;
    });

    
    const tax = Math.round(subtotal * 0.18);   
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + tax + shipping;

    return res.status(200).json({
      message: "cart fetched successfully",
      items: cart.items,
      totalItems,
      subtotal,
      tax,
      shipping,
      total
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch cart"
    });
  }
};


exports.updateCart = async (req, res) => {
  try {

    const userId = req.user.id;
    const { productId, sku, quantity } = req.body;

   
    if (!productId || !sku || quantity === undefined) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    
    const cart = await cartdb.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      item =>
        item.productId.toString() === productId.toString() &&
        item.sku === sku
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
     
      cart.items.splice(itemIndex, 1);
    } else {
     
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    return res.status(200).json({
      message: "Cart updated successfully",
      cart
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update cart"
    });
  }
};



exports.deleteCartItem = async (req, res) => {
  try {

    const userId = req.user.id;
    const { productId, sku } = req.body;

   
    if (!productId || !sku) {
      return res.status(400).json({ message: "ProductId and SKU are required" });
    }

  
    const cart = await cartdb.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

   
    const itemIndex = cart.items.findIndex(
      item =>
        item.productId.toString() === productId.toString() &&
        item.sku === sku
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

  
    cart.items.splice(itemIndex, 1);

    await cart.save();

    return res.status(200).json({
      message: "Item removed successfully",
      cart
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to remove item"
    });
  }
};