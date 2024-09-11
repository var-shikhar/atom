import User from "../modal/user.js";
import CONSTANT from "../constant/constant.js";

const {RouteCode} = CONSTANT;

const getMemberList = async (req, res) => {
    try {
        const foundUsers = await User.aggregate([
            { $match: { isAdmin: false } },
            {
                $lookup: {
                    from: 'Order',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'orders'
                }
            },
            {
                $addFields: {
                    userName: { 
                        $concat: ["$firstName", " ", "$lastName"]
                    },
                    totalOrderAmount: { 
                        $sum: {
                            $map: {
                                input: "$orders",
                                as: "order",
                                in: "$$order.finalAmount"
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    userName: 1,
                    email: 1,
                    phone: 1,
                    totalOrderAmount: 1
                }
            },
            { $sort: { launchDate: -1 } }
        ]);
    
        return res.status(RouteCode.SUCCESS.statusCode).json(foundUsers);
    } catch (err) {
        console.error('Error retrieving product list:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
}


export default {
    getMemberList
}