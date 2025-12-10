import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

interface Props {
    icon: LucideIcon;
    badgeText: string;
    title: string;
    description: string;
    href: string;
    buttonText?: string;
}

const SectionHeader = ({
    icon: Icon,
    badgeText,
    title,
    description,
    href,
    buttonText = "Ver Todo",
}: Props) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-pink-500" />
                    <Badge
                        variant="outline"
                        className="text-pink-600 border-pink-400 bg-pink-50"
                    >
                        {badgeText}
                    </Badge>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {title}
                </h2>

                <p className="text-gray-600 text-sm md:text-base">{description}</p>
            </div>

            <Link href={href} className="hidden md:block">
                <Button
                    variant="outline"
                    className="items-center gap-2 hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-colors"
                >
                    {buttonText}
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </Link>
        </div>
    );
};

export default SectionHeader;
