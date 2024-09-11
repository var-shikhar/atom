import User from "../modal/user.js";
import CONSTANT from "../constant/constant.js";
import Order from "../modal/order.js";

const {RouteCode} = CONSTANT;

const getMemberList = async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false });
                
        const usersWithOrderTotals = await Promise.all(users.map(async (user) => {
            const orders = await Order.find({ userId: user._id }); 
            const totalOrderAmount = orders.reduce((total, order) => total + order.finalAmount, 0);

            return {
                userID: user._id, 
                userName: `${user.firstName} ${user.lastName}`,
                userEmail: user.email,
                userPhone: user.phone,
                totalAmount: totalOrderAmount
            };
        }));


        console.log(usersWithOrderTotals)
        return res.status(RouteCode.SUCCESS.statusCode).json(usersWithOrderTotals);
    } catch (err) {
        console.error('Error retrieving product list:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
}


export default {
    getMemberList
}