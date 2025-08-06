"use client";

import { usePathname } from "next/navigation";
import { NavigationMenuLink } from "../ui/navigation-menu";
import Link from "next/link";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  console.log("pathname: ", pathname);
  const isActive = href === pathname;
  console.log("href: ", href);

  return (
    <NavigationMenuLink asChild active={isActive}>
      <Link
        href={href}
        className="NavigationMenuLink hover:bg-gray-500 hover:text-white text-md font-semibold"
      >
        {children}
      </Link>
    </NavigationMenuLink>
  );
}

export default NavLink;
