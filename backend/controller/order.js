import User from "../modal/user.js";
import CONSTANT from "../constant/constant.js";
import State from "../modal/state.js";
import Country from "../modal/country.js";
import Order from "../modal/order.js";
import Product from "../modal/product.js";
import Coupon from "../modal/coupon.js";

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
        const orderList = await Order.find({}, '_id buyerName createdAt finalAmount shippingAddress.city shippingAddress.stateId status paymentMode').populate('shippingAddress.stateId').sort({createdAt: -1});
        return res.status(RouteCode.SUCCESS.statusCode).json(orderList);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
const getOrderDetail = async (req, res) => {
    const { orderID } = req.params;
    try {
        const orderDetails = await Order.findById(orderID)
            .populate({ path: 'products.productId', model: 'Product' })
            .populate('shippingAddress.stateId')
            .populate('shippingAddress.countryId');
            
        if (!orderDetails) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Order not found, Try later!' });
        }

        const productDetailsPromises = orderDetails.products.map(async (product) => {
            const foundProduct = product.productId ? product.productId.toObject() : null;

            if (!foundProduct) {
                return {
                    _id: null,
                    productName: 'Product not found',
                    productDescription: '',
                    productPrice: 0,
                    productQuantity: 0,
                    productSKU: '',
                    productImage: '',
                    isVariation: false,
                    variationID: '',
                    variationType: '',
                };
            }

            if (product.isVariation && product.variationId !== '') {
                const variation = foundProduct.variations?.find(item => item._id.toString() === product.variationId.toString());

                if (!variation) {
                    return null;
                }

                return {
                    _id: foundProduct._id,
                    productName: foundProduct.name,
                    productDescription: foundProduct.description,
                    productPrice: product.price,
                    productQuantity: product.quantity,
                    productSKU: variation.sku,
                    productImage: variation.images?.length > 0 ? variation.images[0] : foundProduct.images?.[0] || '',
                    isVariation: true,
                    variationID: variation._id,
                    variationType: variation.value,
                };
            } else {
                return {
                    _id: foundProduct._id,
                    productName: foundProduct.name,
                    productDescription: foundProduct.description,
                    productPrice: product.price,
                    productQuantity: product.quantity,
                    productSKU: foundProduct.baseSku,
                    productImage: foundProduct.images?.[0] || '',
                    isVariation: false,
                    variationID: '',
                    variationType: '',
                };
            }
        });

        const productDetails = (await Promise.all(productDetailsPromises)).filter(Boolean);

        const foundOrder = {
            ...orderDetails.toObject(),
            products: productDetails
        };

        return res.status(RouteCode.SUCCESS.statusCode).json(foundOrder);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getStatusList = async (req, res) => {
    const { orderID } = req.params;
    try {
        const foundOrder = await Order.findById(orderID)
        if (!foundOrder) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Order not found, Try later!' });
        }

        const foundData = {
            status: foundOrder.status,
            statusList: foundOrder.statusLog,
        }

        return res.status(RouteCode.SUCCESS.statusCode).json(foundData);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putOrderStatusUpdate = async (req, res) => {
    const { orderID, statusID, note } = req.body;
    try {
        const foundOrder = await Order.findById(orderID);
        if (!foundOrder) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Order not found, Try later!' });
        }

        foundOrder.status = statusID;
        foundOrder.statusLog.unshift({
            note: note,
            status: statusID,
            updateDate: new Date()
        });

        await foundOrder.save()       
        return res.status(RouteCode.SUCCESS.statusCode).json({message: 'Order Status has updated successfully!'});
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
}; 



// Public Controllers
// Get Controllers
const getUserOrderList = async (req, res) => {
    const userID = req.user;
    try {
        const orderList = await Order.find({ userId: userID, status: { $ne: 'Pending' } })
            .populate({ path: 'products.productId', model: 'Product' })
            .sort({ createdAt: -1 });

        const foundOrders = orderList?.map(item => {
            return {
                orderID: item._id,
                orderDate: item.orderDate,
                orderTotal: item.finalAmount,
                buyerName: item.buyerName,
                paymentMode: item.paymentMode,
                productList: item.products?.map(productEntry => {
                    const product = productEntry.isVariation
                        ? productEntry.productId.variations.find(varProduct => varProduct._id.toString() === productEntry.variationId)
                        : productEntry.productId;

                    return {
                        productID: productEntry.productId?._id,
                        productName: productEntry.productId?.name,
                        productImage: product.images?.length > 0 ? product.images[0] : productEntry.productId.images[0],
                        productQty: productEntry.quantity,
                    };
                }),
                hasFeedback: item.receivedFeedback,
                feedback: {
                    text: item.feedback?.text,
                    image: item.feedback?.image,
                },
                status: item.status,
            };
        });

        return res.status(RouteCode.SUCCESS.statusCode).json(foundOrders);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};


// Post Controllers
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
    const { buyerName, buyerEmail, buyerPhone, bilingAddress, isSimilar, shippingAddress, city, stateID, zipCode, countryID, subTotal, totalTax, discount, finalAmount, products, hasDiscount, discountCode } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized Access, Try again!' });
        }

        const newOrder = new Order({
            userId: userID,
            buyerName: buyerName,
            buyerEmail: buyerEmail, 
            buyerPhone: buyerPhone,
            shippingAddress: {
                billingAddress: bilingAddress,
                shippingAddress: isSimilar ? bilingAddress : shippingAddress,
                city: city,
                stateId: stateID,
                zipCode: zipCode,
                countryId: countryID,
            },
            totalAmount: subTotal,
            discount: hasDiscount ? discount : 0,
            totalTax: totalTax,
            finalAmount: finalAmount,
            products: products?.map(item => ({
                productId: item.productId,
                isVariation: item.isVariation,
                quantity: item.productQuantity,
                variationId: item.variationID,
                price: item.productPrice,
            })),
            status: 'Pending',
        });

        // Update user's cart
        foundUser.cart = [];
        await foundUser.save();

        // Save the new order
        await newOrder.save();

        // Adjust stock levels for products and variations
        for (const item of products) {
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

        if(hasDiscount){
            const coupon = await Coupon.findOne({code: discountCode});
            if(coupon){
                coupon.usedCount += 1;
                await coupon.save();
            }
        }

        const orderDetails = {
            message: 'Order placed successfully',
            orderID: newOrder._id,
            totalAmount: newOrder.totalAmount,
            buyerName: newOrder.buyerName,
            orderMode: '',
        }

        // Return the necessary details to the frontend
        return res.status(RouteCode.SUCCESS.statusCode).json(orderDetails);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

// Put Controllers
const putValidateCoupon = async (req, res) => {
    const { code, totalAmount } = req.body;
    try {
        const coupon = await Coupon.findOne({ code, isActive: true });
        if (!coupon) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Invalid or expired coupon.' });
        }

        const currentDate = new Date();
        currentDate.setHours(0,0,0,0);

        const couponStDate = new Date(coupon.startDate)
        const couponEdDate = new Date(coupon.expirationDate)
        couponStDate.setHours(0,0,0,0);
        couponEdDate.setHours(0,0,0,0);

        if (currentDate < couponStDate || currentDate > couponEdDate) {
            return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Coupon has expired.' });
        }

        // Check if the minimum order amount is met
        if (totalAmount < coupon.minOrderAmount) {
            return res.status(RouteCode.CONFLICT.statusCode).json({ message: `Minimum order amount of ${coupon.minOrderAmount} is required to use this coupon.` });
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discountType === 'Percentage') {
            discount = (totalAmount * coupon.discountValue) / 100;
        } else if (coupon.discountType === 'Fixed') {
            discount = coupon.discountValue;
        }

        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Coupon usage limit has been reached.' });
        }


        return res.status(RouteCode.SUCCESS.statusCode).json({
            message: 'Coupon applied successfully',
            discount,
            finalAmount: totalAmount - discount
        });
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: 'Server error occurred while validating coupon.' });
    }
};
const putOrderConfirmation = async (req, res) => {
    const userID = req.user;    
    const { buyerName, orderID, orderAmount, paymentMode } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized Access, Try again!' });
        }

        const foundOrder = await Order.findById(orderID);
        if(!foundOrder){
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Order not found, Try again!' });
        }

        foundOrder.paymentMode = paymentMode;
        foundOrder.status = 'Received';
        foundOrder.statusLog.push({
            status: 'Received',
            note: 'Order Received'
        });

        // Save order
        await foundOrder.save();

        // Return the necessary details to the frontend
        return res.status(RouteCode.SUCCESS.statusCode).json({message: 'Order has received successfully!'});
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};



export default {
    getAPIAddress, getOrderList, getOrderDetail, getStatusList, putOrderStatusUpdate,
    getUserOrderList, postGoToCheckout, putValidateCoupon, postCheckout, putOrderConfirmation,
}
