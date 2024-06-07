"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";

function LandingNavigation() {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between p-3 bg-dwellow-primary-300">
      <Link to="/" className="absolute left-4 text-2xl font-bold text-dwellow-white-200">Dwellow</Link>
      <div className="flex-1 flex justify-center">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-14">
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className="text-dwellow-white-200 font-medium">
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="">
                <NavigationMenuLink className="text-dwellow-white-200 font-medium">
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="">
                <NavigationMenuLink className="text-dwellow-white-200 font-medium">
                  Features
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="">
                <NavigationMenuLink className="text-dwellow-white-200 font-medium">
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="absolute right-0 flex space-x-4 mr-4">
        <Link to="/login" className="mr-2 mt-1 text-dwellow-white-200 font-medium">Log in</Link>
        <Link to="/register"><Button variant="outline" 
        className="text-dwellow-white-200 bg-dwellow-primary-300 hover:bg-dwellow-primary-400 hover:text-dwellow-white-200 font-medium">
            Get Started</Button></Link>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default LandingNavigation;
