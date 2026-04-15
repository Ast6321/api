const Order = require("../model/orderschema");
const cartdb = require("../model/cartschema");

exports.placeOrder = async (req, res) => {
  try {

    const userId = req.user.id;

  
    const cart = await cartdb.findOne({ userId });

  
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }


    const totalAmount = cart.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const order = new Order({
      userId,
      items: cart.items,
      totalAmount,
      address: req.body.address,
      paymentMethod: req.body.paymentMethod || "COD"
    });


    await order.save();


    cart.items = [];
    await cart.save();


    res.status(201).json({
      message: "Order placed successfully",
      order
    });

  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      err
    });
  }
};



exports.getMyOrders = async (req, res) => {
  try {

    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "orders fetched successfully",
      count: orders.length,
      orders
    });

  } catch (err) {
    res.status(500).json({
      message: "internal server error",
      err
    });
  }
};