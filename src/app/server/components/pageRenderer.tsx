"use server";
import React from "react";
import { Element, Page } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/client/components/ui/button";
import PostList from "./postList";
import ElementRenderer from "./elementRenderer";
function convertAttributes(
  attributes: Array<{ name: string; value: string }> | null | undefined
): Record<string, string> {
  if (!attributes) return {};

  return attributes.reduce((acc, attr) => {
    return {
      ...acc,
      [attr.name]: attr.value,
    };
  }, {});
}

// Helper function to check if styles is an array of objects with property/value
// or a Record<string, string>
function isStyleArray(
  styles: any
): styles is Array<{ property: string; value: string }> {
  return (
    Array.isArray(styles) &&
    styles.length > 0 &&
    "property" in styles[0] &&
    "value" in styles[0]
  );
}

// Convert styles to a CSS style object
const convertStyles = (styles: any): React.CSSProperties => {
  if (!styles) return {};

  if (isStyleArray(styles)) {
    // Handle array of { property, value } objects
    return styles.reduce((acc, style) => {
      const propertyName = style.property.replace(/-([a-z])/g, (g) =>
        g[1].toUpperCase()
      );
      return {
        ...acc,
        [propertyName]: style.value,
      };
    }, {} as React.CSSProperties);
  } else if (typeof styles === "object") {
    // Handle Record<string, string>
    return Object.entries(styles).reduce((acc, [property, value]) => {
      const propertyName = property.replace(/-([a-z])/g, (g) =>
        g[1].toUpperCase()
      );
      return {
        ...acc,
        [propertyName]: value,
      };
    }, {} as React.CSSProperties);
  }

  return {};
};

export default async function PageRenderer({ page }: { page: Page }) {
  return (
    <div className="page-renderer">
      <main className="page-content">
        {page.elements.map((element: any, index: number) => (
          <ElementRenderer key={index} element={element} />
        ))}
      </main>
    </div>
  );
}
