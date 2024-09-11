import User from "../modal/user.js";
import CONSTANT from "../constant/constant.js";
import State from "../modal/state.js";
import Country from "../modal/country.js";
import Order from "../modal/order.js";
import Product from "../modal/product.js";

const { RouteCode } = CONSTANT;

const getAPIAddress = async (req, res) => {
    try {
        const stateList = await State.find();
        const countryList = await Country.find();

        const foundData = {
            stateList : stateList,
            countryList : countryList,
        }

        res.status(RouteCode.SUCCESS.statusCode).json(foundData);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
const getOrderList = async (req, res) => {
    try {
        const orderList = await Order.find({}, '_id buyerName createdAt finalAmount shippingAddress.city shippingAddress.stateId status').populate('shippingAddress.stateId').sort({createdAt: -1});
        return res.status(RouteCode.SUCCESS.statusCode).json(orderList);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
const getOrderDetail = async (req, res) => {
    const { orderID } = req.params;
    try {
        const orderDetails = await Order.findById(orderID).populate({path: 'products.productId', model: 'Product'});
        if(!orderDetails){
            return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Order not found, Try later!'});
        }

        const productDetailsPromises = orderDetails.products.map(async product => {
            const foundProduct = product.productId.toObject();
            console.log(foundProduct)
            console.log(product.productId)
    
            if (foundProduct.isVariation && foundProduct.variationId) {
                const variation = await Variation.findById(foundProduct.variationId);
                
                if (!variation) {
                    throw new Error('Variation not found');
                }
    
                // Return combined product and variation details
                return {
                    _id: foundProduct._id,
                    name: foundProduct.name,
                    description: foundProduct.description,
                    variation: {
                        value: variation.value,
                        images: variation.images,
                        mrpPrice: variation.mrpPrice,
                        sellingPrice: variation.sellingPrice,
                        stock: variation.stock,
                        sku: variation.sku,
                        isAvailable: variation.isAvailable
                    }
                };
            } else {
                // Return only the product details if no variation
                return {
                    _id: foundProduct._id,
                    name: foundProduct.name,
                    description: foundProduct.description,
                    baseMRPPrice: foundProduct.baseMRPPrice,
                    baseSellingPrice: foundProduct.baseSellingPrice,
                    baseStock: foundProduct.baseStock,
                    baseSku: foundProduct.baseSku,
                    images: foundProduct.images,
                    isAvailable: foundProduct.isAvailable
                };
            }
        });
    
        const productDetails = await Promise.all(productDetailsPromises);
    
        return {
            ...orderDetails.toObject(),
            products: productDetails
        };


        // return res.status(RouteCode.SUCCESS.statusCode).json(orderDetails);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}

const postGoToCheckout = async (req, res) => {
    const userID = req.user;
    const { orderData } = req.body;
    if (!orderData || !Array.isArray(orderData)) {
        return res.status(RouteCode.BAD_REQUEST.statusCode).json({ message: 'Invalid order data' });
    }
    try {
        const foundUser = await User.findById(userID);
        if(!foundUser){
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized Access, Try again!' });
        }

        const cartList = orderData.map(item => {
            return {
                productId: item.productId,
                productQuantity: item.productQuantity,
                isVariation: item.isVariation,
                variationID: item.variationID,
            }
        })

        foundUser.cart = cartList;
        await foundUser.save();
        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Cart updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
const postCheckout = async (req, res) => {
    const userID = req.user;
    const { buyerName, buyerPhone, addressLine1, addressLine2, city, stateID, zipCode, countryID, orderData } = req.body;
    
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized Access, Try again!' });
        }

        let totalAmount = 0;
        orderData?.forEach(item => {
            totalAmount += item.productPrice * item.productQuantity;
        });

        const newOrder = new Order({
            buyerName: buyerName,
            buyerPhone: buyerPhone,
            userId: userID,
            orderDate: new Date(),
            shippingAddress: {
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                city: city,
                stateId: stateID,
                zipCode: zipCode,
                countryId: countryID
            },
            discount: 0,  
            finalAmount: totalAmount,
            totalAmount: totalAmount,
            products: orderData?.map(item => ({
                productId: item.productId,
                isVariation: item.isVariation,
                quantity: item.productQuantity,
                variationId: item.variationID,
                price: item.productPrice
            })),
            status: 'Pending',
        });

        foundUser.cart = [];
        await foundUser.save();
        await newOrder.save();

        for (const item of orderData) {
            const product = await Product.findById(item.productId);
            
            if (item.isVariation) {
                const variationIndex = product.variations?.findIndex(variation => variation._id.toString() === item.variationID.toString());
                
                if (variationIndex !== -1 && product.variations[variationIndex].stock >= item.productQuantity) {
                    product.variations[variationIndex].stock -= item.productQuantity;
                } else {
                    return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: `Insufficient stock for variation: ${item.productName}` });
                }
            } else {
                if (product.baseStock >= item.productQuantity) {
                    product.baseStock -= item.productQuantity;
                } else {
                    return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: `Insufficient stock for product: ${item.productName}` });
                }
            }
            await product.save();
        }

        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Order placed successfully' });
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};



export default {
    getAPIAddress, getOrderList, getOrderDetail,
    postGoToCheckout, postCheckout 
}
