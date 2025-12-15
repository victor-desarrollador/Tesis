import { cn } from "../../lib/utils";
import React from "react";

const HrLine = ({ className }: { className?: string }) => {
  return (
    <div className={`w-full h-px bg-tiendaLVAccent/20 ${className}`}></div>
  );
};

export default HrLine;
