import React from "react";
import { Element, Page } from "@/types/types";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import PostList from "./blog/postList";

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

export const ElementRenderer: React.FC<{ element: any }> = ({ element }) => {
  const { type, content, styles, children } = element;
  const rawAttributes = element.attributes || null;
  // Convert attributes if needed
  const attributes = Array.isArray(rawAttributes)
    ? convertAttributes(rawAttributes)
    : rawAttributes || {};
  // Convert the styles to a React style object
  const styleObject = convertStyles(styles);
  // Create the props for the element
  const props = {
    style: styleObject,
    ...attributes,
  };

  // If the element has no type, just render the content directly
  if (!type || type === "") {
    return (
      <>
        {content}
        {children?.map((child: any, i: number) => (
          <ElementRenderer key={i} element={child} />
        ))}
      </>
    );
  }

  // Render the appropriate element based on type
  switch (type) {
    case "h1":
      return (
        <h1 {...props}>
          {content}
          {children?.map((child: any, i: number) => (
            <ElementRenderer key={i} element={child} />
          ))}
        </h1>
      );
    case "h2":
      return (
        <h2 {...props}>
          {content}
          {children?.map((child: any, i: number) => (
            <ElementRenderer key={i} element={child} />
          ))}
        </h2>
      );
    case "h3":
      return (
        <h3 {...props}>
          {content}
          {children?.map((child: any, i: number) => (
            <ElementRenderer key={i} element={child} />
          ))}
        </h3>
      );
    case "h4":
      return (
        <h4 {...props}>
          {content}
          {children?.map((child: any, i: number) => (
            <ElementRenderer key={i} element={child} />
          ))}
        </h4>
      );
    case "h5":
      return (
        <h5 {...props}>
          {content}
          {children?.map((child: any, i: number) => (
            <ElementRenderer key={i} element={child} />
          ))}
        </h5>
      );
    case "h6":
      return (
        <h6 {...props}>
          {content}
          {children?.map((child: any, i: number) => (
            <ElementRenderer key={i} element={child} />
          ))}
        </h6>
      );
    case "p":
      return (
        <p {...props}>
          {content}
          {children?.map((child: any, i: number) => (
            <ElementRenderer key={i} element={child} />
          ))}
        </p>
      );
    case "a":
      // Make sure href exists, defaulting to "/" if not provided
      const href = attributes?.href || "/";
      // Remove href from props to avoid duplicate props
      const { href: _hrefProp, ...linkProps } = props;
      return (
        <Link href={href} {...linkProps}>
          {content}
          {children?.map((child: any, i: number) => (
            <ElementRenderer key={i} element={child} />
          ))}
        </Link>
      );
    case "img":
      // Get required props with defaults
      const imgSrc = content || "";
      const imgAlt = attributes?.alt || "";
      const width = parseInt(attributes?.width || "100", 10);
      const height = parseInt(attributes?.height || "100", 10);
      // Remove these from props to avoid duplicates
      const {
        src: _srcProp,
        alt: _altProp,
        width: _widthProp,
        height: _heightProp,
        ...imageProps
      } = props;
      return (
        <Image
          src={imgSrc}
          alt={imgAlt}
          width={width}
          height={height}
          {...imageProps}
        />
      );
    case "button":
      return (
        <Button {...props}>
          {content}
          {children?.map((child: any, i: number) => (
            <ElementRenderer key={i} element={child} />
          ))}
        </Button>
      );
    case "section":
      return (
        <section {...props}>
          {content}
          {children?.map((child: any, i: number) => (
            <ElementRenderer key={i} element={child} />
          ))}
        </section>
      );
    case "nav":
      return (
        <nav {...props}>
          {content}
          {children?.map((child: any, i: number) => (
            <ElementRenderer key={i} element={child} />
          ))}
        </nav>
      );
    case "header":
      return (
        <header {...props}>
          {content}
          {children?.map((child: any, i: number) => (
            <ElementRenderer key={i} element={child} />
          ))}
        </header>
      );
    case "footer":
      return (
        <footer {...props}>
          {content}
          {children?.map((child: any, i: number) => (
            <ElementRenderer key={i} element={child} />
          ))}
        </footer>
      );
    case "span":
      return (
        <span {...props}>
          {content}
          {children?.map((child: any, i: number) => (
            <ElementRenderer key={i} element={child} />
          ))}
        </span>
      );
    case "div":
      return (
        <div {...props}>
          {content}
          {children?.map((child: any, i: number) => (
            <ElementRenderer key={i} element={child} />
          ))}
        </div>
      );
    case "BlogPostList":
      return (
        <PostList {...props}>
          {content}
          {children?.map((child: any, i: number) => (
            <ElementRenderer key={i} element={child} />
          ))}
        </PostList>
      );
    default:
      return (
        <div {...props}>
          {content}
          {children?.map((child: any, i: number) => (
            <ElementRenderer key={i} element={child} />
          ))}
        </div>
      );
  }
};

// Page renderer component
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
