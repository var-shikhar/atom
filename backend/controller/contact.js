import CONSTANT from "../constant/constant.js";
import ContactLead from "../modal/contactLead.js";
import User from "../modal/user.js";

const {RouteCode} = CONSTANT;

// Get List Controller
const getContactLeadList = async (req, res) => {
    try {
        const contactLeadList = await ContactLead.find().sort({ createdAt: -1 });

        const leadList = contactLeadList?.length > 0 ? (
            contactLeadList.map(item => { 
                return { 
                    userName: item.firstName + ' ' + item.lastName,
                    _id: item._id,
                    email: item.email,
                    phone: item.phone,
                    message: item.message,
                    status: item.status,
                    createdAt: item.createdAt
                } 
            })
        ) : [] 

        return res.status(RouteCode.SUCCESS.statusCode).json(leadList);
    } catch (err) {
        console.error('Error retrieving Coupon list:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
}
// Post Controller
const postContactLead = async (req, res) => {
    const { firstName, lastName, email, phone, message } = req.body;
    try {
        const newContactLead = new ContactLead({
            firstName,
            lastName,
            email,
            phone,
            message,
            status: 'Pending',
        });

        await newContactLead.save();
        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Request has shared successfully' });
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
// Put Status Controller
const putContactLeadStatus = async (req, res) => {
    const userID = req.user;
    const { leadID, statusID } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        const contactLead = await ContactLead.findById(leadID);
        if (!contactLead) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        contactLead.status = statusID;

        await contactLead.save();
        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Lead Status has updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
// Delete Controller
const deleteContactLead = async (req, res) => {
    const userID = req.user;
    const { leadID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        const contactLead = await ContactLead.findById(leadID);
        if (!contactLead) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        await contactLead.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Contact Lead has deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};


export default {
    getContactLeadList, postContactLead, putContactLeadStatus, deleteContactLead,
}