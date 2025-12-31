import { Company } from "../models/company.model.js";

// GET ALL COMPANIES (ADMIN)
export const getAllCompaniesAdmin = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate("userId", "fullname email");

    res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load companies",
    });
  }
};

// DELETE COMPANY (ADMIN)
export const deleteCompanyAdmin = async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete company",
    });
  }
};



// ADMIN CREATE COMPANY


export const createCompanyAdmin = async (req, res) => {
  try {
    const {
      companyName,
      description,
      website,
      location,
      employerId
    } = req.body;

    // multer.fields() → files in req.files
    const uploadedFile = req.files?.file?.[0];

    if (!companyName || !employerId) {
      return res.status(400).json({
        success: false,
        message: "Company name and employer are required"
      });
    }

    // prevent duplicate company
    const existingCompany = await Company.findOne({ name: companyName });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company already exists"
      });
    }

    const company = await Company.create({
      name: companyName,
      description,
      website,
      location,
      logo: uploadedFile ? uploadedFile.path : "",
      userId: employerId   // 🔥 IMPORTANT
    });

    return res.status(201).json({
      success: true,
      message: "Company created successfully by admin",
      company
    });

  } catch (error) {
    console.log("Admin create company error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// ADMIN UPDATE COMPANY
export const updateCompanyAdmin = async (req, res) => {
  try {
    // console.log("ADMIN UPDATE BODY 👉", req.body);
    // console.log("ADMIN UPDATE FILES 👉", req.files);

    const { name, description, website, location, employerId } = req.body;
    const uploadedFile = req.files?.file?.[0];

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    if (name) company.name = name;
    if (description) company.description = description;
    if (website) company.website = website;
    if (location) company.location = location;

    // admin can reassign employer
    if (employerId) {
      company.userId = employerId;
    }

    if (uploadedFile) {
      company.logo = uploadedFile.path;
    }

    await company.save();

    return res.status(200).json({
      success: true,
      message: "Company updated successfully by admin",
      company
    });

  } catch (error) {
    console.log("Admin update company error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

import { User } from "../models/user.model.js";

export const getAllEmployers = async (req, res) => {
  try {
    const employers = await User.find({ role: "employer" })
      .select("_id fullname email");

    res.status(200).json({
      success: true,
      employers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load employers",
    });
  }
};

export const getCompanyByIdAdmin = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate("userId", "_id fullname email");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load company",
    });
  }
};
