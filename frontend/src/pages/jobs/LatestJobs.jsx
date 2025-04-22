import useGetAllJobs from "../../hooks/useGetAllJobs";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

const LatestJobs = () => {
  // Fetch jobs using the custom hook
  useGetAllJobs();

  // Access Redux state
  const { allJobs, loading } = useSelector((store) => store.job);

  return (
    <div className="max-w-7xl mx-auto my-20">
      <h1 className="text-4xl font-bold text-center">
        <span className="text-[#6A38C2]">Latest & Top </span> Job Openings
      </h1>

      {/* Loading State */}
      {loading && (
        <p className="text-center my-5">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
        </p>
      )}

      {/* Job Cards */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-10">
          {allJobs.length === 0 ? (
            <p className="text-center col-span-full">No Job Available</p>
          ) : (
            allJobs.map((job) => <LatestJobCards key={job._id} job={job} />)
          )}
        </div>
      )}
    </div>
  );
};

export default LatestJobs;
