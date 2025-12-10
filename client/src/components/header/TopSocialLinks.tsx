"use client";

import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";
import React from "react";

const socialLinks = [
  {
    title: "Facebook",
    icon: Facebook,
    href: "https://facebook.com/", // <- poné tu link real
  },
  {
    title: "Instagram",
    icon: Instagram,
    href: "https://instagram.com/", // <- poné tu link real
  },
];

const TopSocialLinks = () => {
  return (
    <div className="flex items-center gap-3">
      {socialLinks.map(({ title, icon: Icon, href }) => (
        <Link
          key={title}
          href={href}
          aria-label={title}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-babyshopWhite hoverEffect"
        >
          <Icon size={18} strokeWidth={1.8} />
        </Link>
      ))}
    </div>
  );
};

export default TopSocialLinks;
