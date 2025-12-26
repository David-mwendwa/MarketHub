import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from '../utils/customErrors.js';
import sendToken from '../utils/jwt.js';
import sendEmail from '../utils/sendEmail.js';
import {
  uploadToCloudinary,
  removeFromCloudinary,
} from '../utils/cloudinary.js';

// Register user => /api/v1/register
export const registerUser = async (req, res) => {
  // upload image on cloudinary
  let options = {
    folder: 'avatars',
    width: 150,
    crop: 'scale',
  };
  let result = await upload(req, options);
  // const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //   folder: 'avatars',
  //   width: 150,
  //   crop: 'scale',
  // });
  const { firstName, lastName, email, password, passwordConfirm } = req.body;

  const userData = { ...req.body };

  // Only add avatar if file was uploaded
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'avatars',
      width: 150,
      crop: 'scale',
    });
    userData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const user = await User.create(userData);

  //console.log({ user });

  const token = user.getJwtToken();
  res.status(StatusCodes.CREATED).json({
    success: true,
    token,
  });
};

// login user => /api/v1/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please enter email and password');
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new BadRequestError('Incorrect email or password');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new BadRequestError('Incorrect email or password');
  }
  sendToken(user, StatusCodes.OK, res);
};

// forgot password => /api/v1/password/forgot
export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new NotFoundError('User not found');
  }
  // get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/password/reset/${resetToken}`;
  //TODO: use the one below in dev env
  //const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, please ignore it.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'ShopIT Password Recovery',
      message,
    });
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new InternalServerError(error.message);
  }
};

// reset password => /api/v1/password/reset/:token
export const resetPassword = async (req, res) => {
  // hash url token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    throw new BadRequestError('Password reset token is invalid or has expired');
  }
  if (req.body.password !== req.body.confirmPassword) {
    throw new BadRequestError('Password does not match');
  }
  // setup new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, StatusCodes.OK, res);
};

// Get currently logged in user details => /api/v1/me
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
};

// Update / Change password => /api/v1/password/update
export const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Basic validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(
      new BadRequestError(
        'Please provide current password, new password, and confirm password'
      )
    );
  }
  try {
    // Find user with password field
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return next(new BadRequestError('User not found'));
    }
    // Verify current password
    const isMatched = await user.comparePassword(currentPassword);
    if (!isMatched) {
      return next(new BadRequestError('Current password is incorrect'));
    }
    // Validate new password matches confirm password
    if (newPassword !== confirmPassword) {
      return next(
        new BadRequestError('New password and confirm password do not match')
      );
    }
    // Set both password and passwordConfirm to pass validation
    user.password = newPassword;
    user.passwordConfirm = newPassword; // Add this line
    user.passwordChangedAt = Date.now();

    // Save the user (this will trigger the pre-save middleware)
    await user.save();
    // Generate new token and send response
    sendToken(user, StatusCodes.OK, res);
  } catch (error) {
    console.error('Error updating password:', error);
    next(error);
  }
};

// Update user profile => /api/v1/me/update
export const updateProfile = async (req, res) => {
  try {
    const newUserData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
    };

    // Handle avatar removal if requested
    if (req.body.removeAvatar === 'true') {
      const user = await User.findById(req.user.id);
      if (user.avatar?.public_id) {
        await removeFromCloudinary(user.avatar.public_id);
        newUserData.avatar = null;
      }
    }
    // Handle new avatar upload if provided
    else if (req.files?.avatar) {
      const user = await User.findById(req.user.id);
      const file = req.files.avatar;

      // Delete old avatar if it exists
      if (user.avatar?.public_id) {
        await removeFromCloudinary(user.avatar.public_id);
      }

      // Upload new avatar using the utility function
      const result = await uploadToCloudinary(file.tempFilePath, {
        folder: 'markethub/avatars',
        width: 150,
        height: 150,
        crop: 'fill',
        gravity: 'face',
      });

      newUserData.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    // Update user in database
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }).select('-password');

    res.status(StatusCodes.OK).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

// logout user => /api/v1/logout
export const logout = async (req, res) => {
  res.cookie('token', null, { expires: new Date(Date.now()), httpOnly: true });
  res.status(StatusCodes.OK).json({ success: true, message: 'Logged out' });
};

// Get all users => /api/v1/admin/users
export const allUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ success: true, users });
};

// Get user details => /api/v1/admin/user/:id
export const getUserDetails = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new NotFoundError(`No user found with id: ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ success: true, user });
};

// Update user profile - admin => /api/v1/admin/user/:id
export const updateUser = async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  // TODO: update avatar

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(StatusCodes.OK).json({ success: true, user });
};

// Get user details => /api/v1/admin/user/:id
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new NotFoundError(`No user found with id: ${req.params.id}`);
  }

  // Remove avatar from cloudinary
  const image_id = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(image_id);

  await user.remove();
  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: 'User deleted successfully' });
};
