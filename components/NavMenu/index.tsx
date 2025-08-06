import { getAuthSession } from "@/lib/auth";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../ui/navigation-menu";
import NavLink from "./NavLink";

async function NavMenu() {
  const session = await getAuthSession();

  return (
    <nav className="sticky top-0 left-0 max-w-full w-full bg-muted shadow-md">
      <NavigationMenu className="flex w-full max-w-full justify-around ">
        <NavigationMenuList>
          <NavigationMenuItem className="p-2">
            <NavLink href={session ? "/dashboard" : "/"}>InsightLoop</NavLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuList>
          <NavigationMenuItem className="p-2">
            <NavLink href={`api/auth/${session ? "signout" : "signin"}`}>
              {session ? "LogOut" : "LogIn"}
            </NavLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

export default NavMenu;
