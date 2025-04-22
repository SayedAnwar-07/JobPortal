import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "../../hooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "../../redux/companySlice";

const Companies = () => {
  // Custom hook to fetch all companies
  useGetAllCompanies();

  // State for input text
  const [input, setInput] = useState("");

  // Redux dispatch and navigation
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Update search text in Redux store whenever input changes
  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]); // Added `dispatch` to dependency array

  return (
    <div>
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          {/* Input field for search */}
          <Input
            className="w-fit"
            placeholder="Filter by name"
            value={input} // Controlled input
            onChange={(e) => setInput(e.target.value)}
          />

          {/* Button to navigate to create a new company */}
          <Button onClick={() => navigate("/admin/companies/create")}>
            New Company
          </Button>
        </div>

        {/* Table component to display companies */}
        <CompaniesTable />
      </div>
    </div>
  );
};

export default Companies;
