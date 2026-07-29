import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import UploadCard from "../components/UploadCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero />

      <div className="px-6 pb-20">
        <UploadCard />
      </div>
    </div>
  );
}