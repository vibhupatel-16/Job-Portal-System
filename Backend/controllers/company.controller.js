import { Company } from "../models/company.model.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required",
        success: false
      });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "You cannot register the same company twice",
        success: false
      });
    }

    company = await Company.create({
      name: companyName,
      userId: req.id
    });

    return res.status(201).json({
      message: 'Company registered successfully',
      company,
      success: true
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

export const getCompany = async (req,res)=>{
    try{
        const userId = req.id;
        const companies = await Company.find({userId});
        if(!companies){
            return res.status(404).json({
                message:"Company not found",
                success : "false"
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })

    }catch(error){
        console.log(error);
    }
}

export const getCompanyById = async (req,res)=>{
    try{
        const companyId = req.params.id;
        const company = await Company.findById(companyId)
        if(!company){
           return res.status(404).json({
            message:"Company not found",
            success: false
           })
        }
        return res.status(200).json({
            company,
            success:true
        })

    }catch(error){
        console.log(error);
    }
}

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file; // Cloudinary uploaded file

    // 🔹 Find company by ID
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false
      });
    }

    // 🔹 Update text fields only if they exist
    if (name) company.name = name;
    if (description) company.description = description;
    if (website) company.website = website;
    if (location) company.location = location;

    // 🔹 If logo uploaded → save Cloudinary URL
    if (file) {
      company.logo = file.path;     // Cloudinary image URL
    }

    await company.save();

    return res.status(200).json({
      message: "Company information updated successfully",
      company,
      success: true
    });

  } catch (error) {
    console.log("Update company error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};
