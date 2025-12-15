"use client";
import React from "react";
import Container from "../common/Container";
import { topHelpCenter } from "@/constants/data";
import Link from "next/link";
import SelectCurrency from "./SelectCurrency";
import TopSocialLinks from "./TopSocialLinks";

const TopHeader = () => {
  return (
    <div className="w-full bg-tiendaLVSecondary text-tiendaLVSoft py-1 text-sm font-medium">
      <Container className="grid grid-cols-1 md:grid-cols-3">
        <div className="flex items-center gap-5">
          {topHelpCenter?.map((item) => (
            <Link
              key={item?.title}
              href={item?.href}
              className="hover:text-tiendaLVLight hoverEffect"
            >
              {item?.title}
            </Link>
          ))}
        </div>

        <p className="text-center hidden md:inline-flex items-center justify-center">
          Entrega 100 % segura sin necesidad de contratar un servicio de mensajería.
        </p>

        <div className="hidden md:inline-flex items-center justify-end gap-3">
          <SelectCurrency />
          <TopSocialLinks />
        </div>

      </Container>
    </div>
  );
};

export default TopHeader;
