"use client";

import { File, Folder } from "lucide-react";

import React from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { PageInfo } from "@/types/types";

interface VerticalTreeMenuProps {
  routes: PageInfo[];
}
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
  icon: typeof File | typeof Folder;
}

export function parseRoutes(routes: PageInfo[]): TreeNode[] {
  const tree: TreeNode[] = [];

  routes.forEach((route) => {
    const parts = route.route.split("/");
    let currentLevel = tree;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      const existingNode = currentLevel.find((node) => node.name === part);

      if (existingNode) {
        if (isLast) {
          existingNode.route = route.route;
          existingNode.icon = File;
        }
        currentLevel = existingNode.children || (existingNode.children = []);
      } else {
        const newNode: TreeNode = {
          name: part || "Root",
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

  return tree;
}

const TreeNodeComponent: React.FC<{ node: TreeNode; level: number }> = ({
  node,
  level,
}) => {
  const [isOpen, setIsOpen] = React.useState(level === 0);

  if (node.children) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between flex">
            <span className="flex items-center">
              <node.icon className="mr-2 h-4 w-4" />
              {node.name}
            </span>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div>
            {node.children.map((child, index) => (
              <div key={index}>
                <TreeNodeComponent node={child} level={level + 1} />
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div className="ml-4">
      <Button variant="ghost" className="w-full justify-start">
        <node.icon className="mr-2 h-4 w-4" />
        {node.name}
      </Button>
    </div>
  );
};

export const VerticalTreeMenu: React.FC<VerticalTreeMenuProps> = ({
  routes,
}) => {
  const tree = parseRoutes(routes);

  return (
    <div className="absolute top-0 bg-white w-64 border-r h-full p-2">
      <div>
        {tree.map((node, index) => (
          <div key={index}>
            <TreeNodeComponent node={node} level={0} />
          </div>
        ))}
      </div>
    </div>
  );
};
