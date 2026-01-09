"use client";

import React from "react";
import { SignedIn } from "@clerk/clerk-react";
import SideNav from "../_component/SideNav";

const Dashboardlayout = ({ children }) => {
  return (
    <div>
      <SignedIn>
        <div className="w-64 shadow-md border-r   h-screen fixed">
          <SideNav />
        </div>
        <div className="ml-64 ">{children}</div>
      </SignedIn>
    </div>
  );
};

export default Dashboardlayout;
