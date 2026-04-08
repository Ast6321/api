const cartdb = require("../model/cartschema");
const productdb = require("../model/productschema");

exports.addToCart = async (req, res) => {
  try {

    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

   
    const product = await productdb.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

 
    let cart = await cartdb.findOne({ userId });

    
    if (!cart) {
      cart = new cartdb({
        userId,
        items: [
          {
            productId,
            quantity,
            price: product.price
          }
        ]
      });

      await cart.save();

      return res.status(201).json({
        message: "Cart created and item added",
        cart
      });
    }

    
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId.toString()
    );

    if (itemIndex > -1) {
      
      cart.items[itemIndex].quantity += quantity;
    } else {
      
      cart.items.push({
        productId,
        quantity,
        price: product.price
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
        items: [],
        total: 0,
        tax: 0,
        shipping: 0,
        grandTotal: 0
      });
    }

  
    let total = 0;

    
    cart.items.forEach(item => {
      total += item.quantity * item.price;
    });

   
    const tax = total * 0.18;
    const shipping = total > 500 ? 0 : 50;
    const grandTotal = total + tax + shipping;

   
    return res.status(200).json({
      items: cart.items,
      total,
      tax,
      shipping,
      grandTotal
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
    const { productId, quantity } = req.body;

   
    if (!productId || quantity === undefined) {
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
      item => item.productId.toString() === productId.toString()
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
    const { productId } = req.body;

   
    if (!productId) {
      return res.status(400).json({ message: "ProductId is required" });
    }

   
    const cart = await cartdb.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId.toString()
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