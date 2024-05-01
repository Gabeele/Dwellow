"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Units and Properties",
    href: "/properties",
    description:
      "Manage your properties and units with ease. Add, edit, delete, and view all your properties and units in one place.",
  },
  {
    title: "Statistics",
    href: "/statistics",
    description:
      "View statistics for your properties and units. See how your properties are performing and make informed decisions.",
  },
  {
    title: "Maintenance Requests",
    href: "/requests",
    description:
      "Manage maintenance requests from your tenants. View, approve, and complete maintenance requests for your properties.",
  },
  {
    title: "Invitations",
    href: "/invites",
    description:
      "Invite new tenants to your properties. Send invitations to tenants and manage their access to your properties.",
  },
  {
    title: "Manage Team",
    href: "/team",
    description:
      "Manage your team members and their access to your properties.",
  },
];

function Navigation() {
  return (
    <div className="flex justify-center p-1 m-1">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/dashboard"
                    >
                      <Icons.logo className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Dashboard
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Get started with the dashboard. Manage your properties
                        and units, view statistics, and more.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/getting-started" title="Get Started">
                  Learn how to get started with the Dwellow.
                </ListItem>
                <ListItem href="/support" title="Support">
                  Get help with using Dwellow and managing your properties.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="https://api.dwellow.ca/docs">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                API Documentation
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
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
          style={{ padding: "10px" }}
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

export default Navigation;
