"use client";

import { File, Folder, Home } from "lucide-react";
import React from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { Page } from "../../../types/types";

const hiddenRoutes = ["admin", "login", "setup"];

export interface RouteItem {
  route: string;
  filePath: string;
  type: string;
  lastModified: string;
}

export interface TreeNode {
  name: string;
  children?: TreeNode[];
  route?: string;
  icon: typeof File | typeof Folder | typeof Home;
  hasBasePage?: boolean;
}

export function parseRoutes(routes: Page[]): TreeNode[] {
  const tree: TreeNode[] = [];

  // Add home page first
  const homePage = routes.find((route) => route.route === "/");
  if (homePage) {
    tree.push({
      name: "home",
      route: "/",
      icon: Home,
    });
  }

  // First pass: build basic tree structure
  routes.forEach((route) => {
    if (route.route === "/") return;

    const parts = route.route.split("/");
    let currentLevel = tree;

    parts.forEach((part, index) => {
      if (!part) return;

      const isLast = index === parts.length - 1;
      const existingNode = currentLevel.find((node) => node.name === part);

      if (existingNode) {
        if (isLast) {
          existingNode.route = route.route;
          if (!existingNode.children) {
            existingNode.icon = File;
          }
        }
        currentLevel = existingNode.children || (existingNode.children = []);
      } else {
        const newNode: TreeNode = {
          name: part,
          icon: isLast ? File : Folder,
          ...(isLast && { route: route.route }),
        };
        if (!isLast) {
          newNode.children = [];
        }
        currentLevel.push(newNode);
        currentLevel = newNode.children || [];
      }
    });
  });

  // Second pass: mark nodes with base pages
  routes.forEach((route) => {
    if (route.route === "/") return;

    const parts = route.route.split("/");
    let currentNode: TreeNode | undefined;
    let currentLevel = tree;

    parts.forEach((part, index) => {
      if (!part) return;
      currentNode = currentLevel.find((node) => node.name === part);
      if (currentNode?.children) {
        currentNode.hasBasePage =
          route.route === parts.slice(0, index + 1).join("/");
        currentLevel = currentNode.children;
      }
    });
  });

  return tree;
}

export function TreeNodeComponent({
  node,
  level,
  selectedRoute,
  onSelect,
}: {
  node: TreeNode;
  level: number;
  selectedRoute: string | null;
  onSelect: (route: string) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const isSelected = node.route === selectedRoute;

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    if (node.route) {
      onSelect(node.route);
    }
  };

  if (node.children) {
    return (
      <Collapsible open={isOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={`w-full justify-between flex ${
              isSelected ? "bg-zinc-100 dark:bg-zinc-900" : ""
            }`}
            onClick={handleClick}
          >
            <span className="flex items-center capitalize">
              <node.icon className="mr-2 h-4 w-4" />
              {node.name}
            </span>
            {node.children.length > 0 && (
              <span onClick={handleChevronClick}>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="ml-4 space-y-1 mt-1">
            {node.children.map((child, index) => (
              <TreeNodeComponent
                key={index}
                node={child}
                level={level + 1}
                selectedRoute={selectedRoute}
                onSelect={onSelect}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      variant="ghost"
      className={`w-full justify-start capitalize ${
        isSelected ? "bg-zinc-100  dark:bg-zinc-900" : ""
      }`}
      onClick={handleClick}
    >
      <node.icon className="mr-2 h-4 w-4" />
      {node.name}
    </Button>
  );
}

function shouldShowRoute(route: string | undefined): boolean {
  if (!route) return true;
  // Don't hide the root route anymore since we handle it specially in parseRoutes
  return !hiddenRoutes.includes(route);
}

function filterHiddenNodes(node: TreeNode): TreeNode | null {
  // If node has a route and it's hidden, return null
  if (node.route && !shouldShowRoute(node.route)) {
    return null;
  }

  // If node has children, filter them
  if (node.children) {
    const filteredChildren = node.children
      .map((child) => filterHiddenNodes(child))
      .filter((child): child is TreeNode => child !== null);

    // If no children left after filtering and no route, return null
    if (filteredChildren.length === 0 && !node.route) {
      return null;
    }

    return {
      ...node,
      children: filteredChildren,
    };
  }

  return node;
}

export default function VerticalTreeMenu({
  routes,
  selectedRoute,
  onRouteSelect,
}: {
  routes: Page[];
  selectedRoute: string | null;
  onRouteSelect: (route: string) => void;
}) {
  const rawTree = parseRoutes(routes);
  const tree = rawTree
    .map((node) => filterHiddenNodes(node))
    .filter((node): node is TreeNode => node !== null);

  return (
    <div className="bg-background w-64 border-r dark:border-r-dark p-2 space-y-1">
      {tree.map((node, index) => (
        <TreeNodeComponent
          key={index}
          node={node}
          level={0}
          selectedRoute={selectedRoute}
          onSelect={onRouteSelect}
        />
      ))}
    </div>
  );
}
