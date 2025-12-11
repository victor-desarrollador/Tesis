import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const BackToHome = ({ className }: { className?: string }) => {
  return (
    <Link href={"/"}>
      <Button className={className}>Volver a la página de inicio</Button>
    </Link>
  );
};

export default BackToHome;
