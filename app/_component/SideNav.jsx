import React from "react";
import { LibraryBig, LineChart, MessageSquare, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";

const SideNav = () => {
  const path = usePathname();
  const menuList = [
    { id: 1, name: "My Forms", icon: LibraryBig, path: "/Dashboard" },
    {
      id: 2,
      name: "Response",
      icon: MessageSquare,
      path: "/Dashboard/Response",
    },
    { id: 3, name: "Analytics", icon: LineChart, path: "/Dashboard/Analytics" },
    { id: 4, name: "Upgrade", icon: Shield, path: "/Dashboard/Upgrade" },
  ];

  return (
    <div className="h-screen">
      {menuList.map((menu, index) => (
        <div
          key={menu.id}
          className={`flex items-center gap-3 p-4 mb-4 mr-6 ml-3 mt-3 hover:bg-green-600 hover:text-white rounded-xl cursor-pointer ${
            path == menu.path ? "bg-green-600 text-white" : ""
          }`}
        >
          <menu.icon className="w-5 h-5" />
          <span>{menu.name}</span>
        </div>
      ))}
      <div className="w-46  items-center fixed bottom-10 ml-6 ">
        <button className="bg-green-600 text-white p-3 w-full rounded-lg hover:bg-green-700">
          <span className="text-sm ">Create New Form</span>
        </button>
        <div className="my-7 ">
          <Progress className="w-full" value={33} />
        </div>
      </div>
    </div>
  );
};
export default SideNav;
