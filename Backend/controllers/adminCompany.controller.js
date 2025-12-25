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
