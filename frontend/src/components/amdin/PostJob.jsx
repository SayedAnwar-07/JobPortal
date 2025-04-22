import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "../../utils/constant";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany?._id || "" });
  };

  const validateInput = () => {
    if (
      !input.title ||
      !input.description ||
      !input.requirements ||
      !input.salary ||
      !input.location ||
      !input.jobType ||
      !input.experience ||
      input.position <= 0 ||
      !input.companyId
    ) {
      return "All fields are required and must be valid.";
    }
    return null;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                aria-label="Job title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                aria-label="Job description"
              />
            </div>
            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <Input
                id="requirements"
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                aria-label="Job requirements"
              />
            </div>
            <div>
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                aria-label="Job salary"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                aria-label="Job location"
              />
            </div>
            <div>
              <Label htmlFor="jobType">Job Type</Label>
              <Input
                id="jobType"
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                aria-label="Job type"
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Input
                id="experience"
                type="text"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                aria-label="Job experience level"
              />
            </div>
            <div>
              <Label htmlFor="position">No. of Positions</Label>
              <Input
                id="position"
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                aria-label="Number of positions"
                min="1"
              />
            </div>
            {companies.length > 0 && (
              <div>
                <Label htmlFor="company">Company</Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          {error && <p className="text-red-600 font-bold my-2">{error}</p>}
          {loading ? (
            <Button className="w-full my-4" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Post New Job
            </Button>
          )}
          {companies.length === 0 && (
            <p className="text-xs text-red-600 font-bold text-center my-3">
              *Please register a company first before posting a job.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
