import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../middlewares/errorMiddleware";

import Prescription from "../models/prescriptionSchema";
import { User } from "../models/userSchema";

export const createPrescription = catchAsyncErrors(async(req, res, next)=>{
    const { patientId, doctorId, medication, dosage, instructions, date } = req.body;

    if(!patientId || !doctorId || !medication || !dosage || !instructions || !date){
        return next(new ErrorHandler("Fill all fields! ", 400));
    }

    const prescription = await Prescription.create ({
        patientId,
        doctorId,
        medication,
        dosage,
        instructions,
        date
    });
    res.status(200).json({
        success: true,
        message: "Prescription Created Successfully!",
        prescription,
    })
});




export const getAllPrescription = catchAsyncErrors(async(req, res, next)=>{
    const prescription = await Prescription.findOne();
    res.status(200).json({
        success: true,
        prescription,
    });
});




export const getPrescriptionById = catchAsyncErrors(async ( req, res, next)=>{
    const { id } = req.params;
    const prescription = await Prescription.findById(id);

    if (!prescription){
        return next(new ErrorHandler("Prescription not found", 404));

    }

    res.status(200).json({
        success: true,
        prescription,
      });
    
});



export const updatePrescription = catchAsyncErrors(async(req, res, next)=>{
    const {id} = req.params;
    let prescription = await Prescription.findById(id);

    if(!prescription){
        return next(new ErrorHandler("Prescription Not Found!", 404));



    }


    prescription = await Prescription.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    })
})