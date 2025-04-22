import useGetAllJobs from "../../hooks/useGetAllJobs";
import HeroSection from "../../components/home/HeroSection";
import LatestJobs from "../jobs/LatestJobs";

const Home = () => {
  useGetAllJobs();
  return (
    <div className="container mx-auto">
      <HeroSection />
      <LatestJobs />
    </div>
  );
};

export default Home;
