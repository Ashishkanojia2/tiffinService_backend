import { userModal } from "../modals/usersModal.js";
import { errorRes, successRes } from "../utils/globalResponseHandler.js";
import { response } from "express";
import sendToken from "../utils/sendToken.js";
import { HelpSupportModal } from "../modals/HelpSupportModal.js";

const register = async (req, res) => {
  try {
    const { phone, role } = req.body;
    const user = await userModal.findOne({ phone });

    if (!user) {
      const getUser = await userModal.create({ phone, role });
      console.log("user", user);
      return sendToken(res, getUser, 201, "User created successfull");
    } else {
      return sendToken(res, user, 201, "User login successfully");
    }
  } catch (error) {
    console.error("Register Catch Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
};

const logout = async (req, res) => {
  res
    .status(200)
    .cookie("token", null, { expires: new Date(Date.now()) })
    .json({ success: true, message: "Logout successfully" });
};

const addLocation = async (req, res) => {
  try {
    const { address, landMark, pinCode } = req.body;
    const user = await userModal.findById(req.user._id);
    if (!user) {
      return errorRes(res, 404, "User not found!");
    }
    user.address = address;
    user.pinCode = pinCode;
    user.landMark = landMark;

    await user.save();
    successRes(res, 201, "Address added successfully");
  } catch (error) {
    console.error("Register Catch Error:", error);
    errorRes(res, 500, error.message);
    // res.status(500).json({ success: false, message: error.message || error });
  }
};

export { register, logout, addLocation };
