import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  //misedRole
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;

  // Check if all required fields are present
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  // Check if user with the given email already exists
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User is already registered", 400));
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user
  user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password: hashedPassword,
    role: "Patient",
  });

  // Respond with success message

  generateToken(user, "User Registered!", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;

  // Check if all required fields are provided
  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please provide all details", 400));
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match!", 400));
  }

  // Find the user by email and include the password field
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);

  /*This 3 line of code give me the error invalid email or password and i am useing
 the correct email and password but this error getting solve without ignoring these line of code
  */

  // if (!isPasswordMatched) {
  //   return next(new ErrorHandler("Invalid email or password", 400));
  // }

  // Check if the role matches
  if (role !== user.role) {
    return next(new ErrorHandler("User not found with this role!", 400));
  }

  // Generate and send the token
  generateToken(user, "User Login Successfully!", 200, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, password, gender, dob, nic } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler(`${isRegistered.role} with this email are exist`)
    );
  }
  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "New Admin registered successfully!",
    admin,
  });
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const adminLogout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", "Removed_Admin_token", {
      hhtpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully!",
    });
});

export const patientLogout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("patientToken", "Removed_Patient_token", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully!",
    });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }

  // const { docAvatar } = req.body;
  // const allowedFormmats = ["image/png", "image/jpeg", "image/webp"];
  // if (!allowedFormmats.includes(docAvatar.mimetype)) {
  //   return next(new ErrorHandler("File Format not Supported!"));
  // }

  const { docAvatar } = req.files;
const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

if (!docAvatar) {
  return next(new ErrorHandler("No file uploaded", 400)); // Ensure there's a file uploaded
}

if (!allowedFormats.includes(docAvatar.mimetype)) {
  return next(new ErrorHandler("File format not supported!", 400));
}


  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment
  ) {
    return next(new ErrorHandler("Please Provide complete Info!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler(
        `${isRegistered.role} already Exist with provided Email!`
      )
    );
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error",
      cloudinaryResponse.error || "Unknown Cloundiary Error"
    );
  }

  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
    role: "Doctor",
    docAvatar: {
      public_id : cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    
    });
    res.status(200).json({
      success: true,
      message: "New Doctor Registered!",
      doctor
    })
  });







// import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
// import { User } from "../models/userSchema.js";
// import ErrorHandler from "../middlewares/errorMiddleware.js";
// import { generateToken } from "../utils/jwtToken.js";
// import cloudinary from "cloudinary";

// export const patientRegister = catchAsyncErrors(async (req, res, next) => {
//   const { firstName, lastName, email, phone, nic, dob, gender, password } =
//     req.body;
//   if (
//     !firstName ||
//     !lastName ||
//     !email ||
//     !phone ||
//     !nic ||
//     !dob ||
//     !gender ||
//     !password
//   ) {
//     return next(new ErrorHandler("Please Fill Full Form!", 400));
//   }

//   const isRegistered = await User.findOne({ email });
//   if (isRegistered) {
//     return next(new ErrorHandler("User already Registered!", 400));
//   }

//   const user = await User.create({
//     firstName,
//     lastName,
//     email,
//     phone,
//     nic,
//     dob,
//     gender,
//     password,
//     role: "Patient",
//   });
//   generateToken(user, "User Registered!", 200, res);
// });

// export const login = catchAsyncErrors(async (req, res, next) => {
//   const { email, password, confirmPassword, role } = req.body;
//   if (!email || !password || !confirmPassword || !role) {
//     return next(new ErrorHandler("Please Fill Full Form!", 400));
//   }
//   if (password !== confirmPassword) {
//     return next(
//       new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
//     );
//   }
//   const user = await User.findOne({ email }).select("+password");
//   if (!user) {
//     return next(new ErrorHandler("Invalid Email Or Password!", 400));
//   }

//   const isPasswordMatch = await user.comparePassword(password);
//   if (!isPasswordMatch) {
//     return next(new ErrorHandler("Invalid Email Or Password!", 400));
//   }
//   if (role !== user.role) {
//     return next(new ErrorHandler(`User Not Found With This Role!`, 400));
//   }
//   generateToken(user, "Login Successfully!", 201, res);
// });

// export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
//   const { firstName, lastName, email, phone, nic, dob, gender, password } =
//     req.body;
//   if (
//     !firstName ||
//     !lastName ||
//     !email ||
//     !phone ||
//     !nic ||
//     !dob ||
//     !gender ||
//     !password
//   ) {
//     return next(new ErrorHandler("Please Fill Full Form!", 400));
//   }

//   const isRegistered = await User.findOne({ email });
//   if (isRegistered) {
//     return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
//   }

//   const admin = await User.create({
//     firstName,
//     lastName,
//     email,
//     phone,
//     nic,
//     dob,
//     gender,
//     password,
//     role: "Admin",
//   });
//   res.status(200).json({
//     success: true,
//     message: "New Admin Registered",
//     admin,
//   });
// });

// export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return next(new ErrorHandler("Doctor Avatar Required!", 400));
//   }
//   const { docAvatar } = req.files;
//   const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
//   if (!allowedFormats.includes(docAvatar.mimetype)) {
//     return next(new ErrorHandler("File Format Not Supported!", 400));
//   }
//   const {
//     firstName,
//     lastName,
//     email,
//     phone,
//     nic,
//     dob,
//     gender,
//     password,
//     doctorDepartment,
//   } = req.body;
//   if (
//     !firstName ||
//     !lastName ||
//     !email ||
//     !phone ||
//     !nic ||
//     !dob ||
//     !gender ||
//     !password ||
//     !doctorDepartment ||
//     !docAvatar
//   ) {
//     return next(new ErrorHandler("Please Fill Full Form!", 400));
//   }
//   const isRegistered = await User.findOne({ email });
//   if (isRegistered) {
//     return next(
//       new ErrorHandler("Doctor With This Email Already Exists!", 400)
//     );
//   }
//   const cloudinaryResponse = await cloudinary.uploader.upload(
//     docAvatar.tempFilePath
//   );
//   if (!cloudinaryResponse || cloudinaryResponse.error) {
//     console.error(
//       "Cloudinary Error:",
//       cloudinaryResponse.error || "Unknown Cloudinary error"
//     );
//     return next(
//       new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
//     );
//   }
//   const doctor = await User.create({
//     firstName,
//     lastName,
//     email,
//     phone,
//     nic,
//     dob,
//     gender,
//     password,
//     role: "Doctor",
//     doctorDepartment,
//     docAvatar: {
//       public_id: cloudinaryResponse.public_id,
//       url: cloudinaryResponse.secure_url,
//     },
//   });
//   res.status(200).json({
//     success: true,
//     message: "New Doctor Registered",
//     doctor,
//   });
// });

// export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
//   const doctors = await User.find({ role: "Doctor" });
//   res.status(200).json({
//     success: true,
//     doctors,
//   });
// });

// export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
//   const user = req.user;
//   res.status(200).json({
//     success: true,
//     user,
//   });
// });

// // Logout function for dashboard admin
// export const adminLogout = catchAsyncErrors(async (req, res, next) => {
//   res
//     .status(201)
//     .cookie("adminToken", "", {
//       httpOnly: true,
//       expires: new Date(Date.now()),
//     })
//     .json({
//       success: true,
//       message: "Admin Logged Out Successfully.",
//     });
// });

// // Logout function for frontend patient
// export const patientLogout = catchAsyncErrors(async (req, res, next) => {
//   res
//     .status(201)
//     .cookie("patientToken", "", {
//       httpOnly: true,
//       expires: new Date(Date.now()),
//     })
//     .json({
//       success: true,
//       message: "Patient Logged Out Successfully.",
//     });
// });