import { Link, Outlet } from "react-router";
import { Leaf } from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";

export default function AuthLayout() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-16">
      <AnimatedBackground variant="vivid" />
      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 font-bold text-white">
          <span className="grid size-10 place-items-center rounded-xl bg-white/20 backdrop-blur">
            <Leaf size={20} />
          </span>
          <span className="text-xl">SkillBridge</span>
        </Link>
        <Outlet />
      </div>
    </div>
  );
}
