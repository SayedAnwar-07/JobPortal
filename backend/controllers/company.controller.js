import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Register a new company
export const registerCompany = async (req, res) => {
  try {
    const { companyName, description, website, location } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false,
      });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "You can't register the same company again.",
        success: false,
      });
    }

    // Process uploaded company logo
    const logoFile = req.files.logo;

    let logo;
    if (logoFile && logoFile[0]) {
      const photoUri = getDataUri(logoFile[0]);
      const photoUpload = await cloudinary.uploader.upload(photoUri.content, {
        folder: "company-logos",
      });
      logo = photoUpload.secure_url;
    }

    // Create the company
    company = await Company.create({
      name: companyName,
      description,
      website,
      location,
      logo,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// Fetch all companies registered by the logged-in user
export const getCompany = async (req, res) => {
  try {
    const userId = req.id;

    const companies = await Company.find({ userId });

    if (!companies || companies.length === 0) {
      return res.status(404).json({
        message: "Companies not found.",
        success: false,
      });
    }

    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get details of a specific company by its ID
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Update company details
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    // Fetch company by ID
    const companyId = req.params.id;
    let company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    // Handle file upload for logo
    let uploadedLogo = req.files?.logo?.[0];
    if (uploadedLogo) {
      const fileUri = getDataUri(uploadedLogo);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      company.logo = cloudResponse.secure_url;
    }

    // Dynamically update fields
    const updates = { name, description, website, location };

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        company[key] = value;
      }
    }

    await company.save();

    const updatedCompany = {
      _id: company._id,
      name: company.name,
      description: company.description,
      website: company.website,
      location: company.location,
      logo: company.logo,
      userId: company.userId,
    };

    return res.status(200).json({
      message: "Company information updated successfully.",
      company: updatedCompany,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while updating the company.",
      error: error.message,
      success: false,
    });
  }
};
