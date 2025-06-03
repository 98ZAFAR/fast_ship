const SellerApplication = require("../models/sellerApplicationModel");
const SellerProfile = require("../models/sellerProfileModel");
const User = require("../models/userModel");
const { sendApprovalEmail } = require("../utils/emailTransporter");

const handleApproveSellerApplication = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required.",
      });
    }

    const sellerApplication = await SellerApplication.findOne({
      where: { userId: sellerId }
    });
    if (!sellerApplication) {
      return res.status(404).json({
        success: false,
        message: "Seller application not found.",
      });
    }

    if (sellerApplication.applicationStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending applications can be approved.",
        });
    }

    const user = await sellerApplication.getUser();

    user.role= "seller";
    await user.save();
    sellerApplication.applicationStatus = "approved";
    await sellerApplication.save();

    const sellerProfile = await SellerProfile.create({
      userId: sellerId,
      businessName: sellerApplication.businessName,
      businessAddress: sellerApplication.businessAddress,
      businessPhone: sellerApplication.businessPhone,
      businessEmail: sellerApplication.businessEmail,
      businessDescription: sellerApplication.businessDescription,
      businessLicenseNumber: sellerApplication.businessLicenseNumber,
      businessWebsite: sellerApplication.businessWebsite,
      businessType: sellerApplication.businessType,
    });

    sendApprovalEmail(user.email, sellerProfile.businessName);
    return res.status(200).json({
      success: true,
      message: "Seller application approved successfully.",
      data: { sellerProfile },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  handleApproveSellerApplication,
};