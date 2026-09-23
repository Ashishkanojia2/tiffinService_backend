const sendToken = (res, data, statusCode = 200, message = "") => {
  const token = data.getJWTToken();

  const userData = {
    _id: data._id,
    phone: data.phone,
  };

  const expiresInMinutes = Number(process.env.JWT_TOKEN_EXPIRE) || 60;
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + expiresInMinutes * 24 * 60 * 60 * 1000),
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message,
      result: { user: userData },
      token,
    });
};
export default sendToken