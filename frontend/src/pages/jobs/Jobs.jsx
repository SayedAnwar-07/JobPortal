import { useEffect, useState } from "react";
import FilterCard from "../../components/FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Jobs = () => {
  const { allJobs, searchedQuery, loading } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState([]);

  useEffect(() => {
    if (searchedQuery) {
      const filteredJobs = allJobs.filter((job) => {
        let matches = true;

        // Check each filter
        for (const [key, value] of Object.entries(searchedQuery)) {
          if (key === "salary") {
            const [min, max] = value.split("-").map(Number);
            matches = matches && job.salary >= min && job.salary <= max;
          } else {
            matches =
              matches && job[key]?.toLowerCase() === value.toLowerCase();
          }
        }
        return matches;
      });

      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          <div className="w-[20%]">
            <FilterCard />
          </div>
          {filterJobs.length <= 0 ? (
            <span className="flex justify-center items-center w-full h-full">
              Job not found
            </span>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-3 gap-4">
                {filterJobs.map((job) => (
                  <motion.div
                    key={job?._id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
