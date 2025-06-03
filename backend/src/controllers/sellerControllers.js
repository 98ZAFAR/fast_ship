const SellerApplication = require("../models/sellerApplicationModel");
const SellerProfile = require("../models/sellerProfileModel");

const handleCreateSellerApplication = async (req, res) => {
  try {
    const {
      businessName,
      businessAddress,
      businessPhone,
      businessEmail,
      businessDescription,
      businessLicenseNumber,
      businessWebsite,
      businessType,
    } = req.body;
    const userId = req.user.id;

    if(!businessName || !businessAddress || !businessPhone || !businessEmail || !businessType) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const existingApplication = await SellerApplication.findOne({
      where: { userId },
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending seller application.",
      });
    }

    const newApplication = await SellerApplication.create({
      userId,
      businessName,
      businessAddress,
      businessPhone,
      businessEmail,
      businessDescription,
      businessLicenseNumber,
      businessWebsite,
      businessType,
    });


    return res.status(201).json({
      success: true,
      message: "Seller application created successfully!",
      data: { application: newApplication },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
    console.error(error);
  }
};

module.exports = {
  handleCreateSellerApplication,
};
