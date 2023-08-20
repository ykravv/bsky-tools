import { Outlet } from "@remix-run/react";
import * as React from "react";

export default function Auth() {
  return (
    <div className="flex min-h-full items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8">
        <Outlet />
      </div>
    </div>
  );
}
