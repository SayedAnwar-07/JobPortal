import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    key: "location",
    array: ["Motijheel", "Narayanganj", "Jatra Bari", "Mirpur-1", "Dhanmondi"],
  },
  {
    filterType: "Job Type",
    key: "jobType",
    array: ["Full-time", "Part-time", "Contract", "Remote"],
  },
  {
    filterType: "Salary",
    key: "salary",
    array: ["0-40000", "40000-100000", "100000-200000"],
  },
];

const FilterCard = () => {
  const [selectedFilters, setSelectedFilters] = useState({});
  const dispatch = useDispatch();

  const changeHandler = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    // Pass the selected filters to Redux store
    dispatch(setSearchedQuery(selectedFilters));
  }, [selectedFilters, dispatch]);

  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3" />
      {filterData.map((data, index) => (
        <div key={index} className="mt-4">
          <h2 className="font-bold text-lg">{data.filterType}</h2>
          <RadioGroup
            value={selectedFilters[data.key] || ""}
            onValueChange={(value) => changeHandler(data.key, value)}
          >
            {data.array.map((item, idx) => {
              const itemId = `id${index}-${idx}`;
              return (
                <div key={itemId} className="flex items-center space-x-2 my-2">
                  <RadioGroupItem value={item} id={itemId} />
                  <Label htmlFor={itemId}>{item}</Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
};

export default FilterCard;
