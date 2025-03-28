"use client";
import { useAuth } from "@/context/AuthContext";

const { SideBarIcon } = require("../ui/icons");

const Header = () => {
  const { logOut } = useAuth();
  return (
    <div className="p-4 flex items-center gap-x-4 justify-between">
      <div className="flex items-center gap-x-4">
        <SideBarIcon />
        <h2 className="font-bold text-2xl">Workflow Builder</h2>
      </div>
      <button
        onClick={logOut}
        className="bg-primary px-2 py-1 text-xl rounded-lg text-foreground hover:text-background border-2 border-solid border-primary hover:bg-transparent cursor-pointer"
      >
        Log out
      </button>
    </div>
  );
};

export default Header;
