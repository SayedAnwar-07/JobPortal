import { useEffect } from "react";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "../../utils/constant";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "../../redux/applicationSlice";

const Applicants = () => {
  const params = useParams(); // Extract route parameters
  const dispatch = useDispatch();
  const { applicants = {} } = useSelector((store) => store.application); // Ensure default value

  useEffect(() => {
    // Fetch all applicants when the component mounts
    const fetchAllApplicants = async () => {
      try {
        if (!params?.id) {
          console.error("Job ID not found in route parameters");
          return;
        }
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          { withCredentials: true }
        );
        if (res.data?.job) {
          dispatch(setAllApplicants(res.data.job)); // Dispatch data to Redux
        } else {
          console.warn("Unexpected API response structure", res.data);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };
    fetchAllApplicants();
  }, [params?.id, dispatch]); // Add dependencies to avoid missing updates

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <h1 className="font-bold text-xl my-5">
          Applicants {applicants?.applications?.length || 0}{" "}
          {/* Fallback to 0 */}
        </h1>
        <ApplicantsTable />
      </div>
    </div>
  );
};

export default Applicants;
