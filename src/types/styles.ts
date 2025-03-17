import { z } from "zod";

// Typography-related schemas
export const fontSizeSchema = z.enum([
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
  "42px",
  "48px",
  "64px",
]);
export const fontWeightSchema = z.enum([
  "normal",
  "bold",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
]);
export const fontStyleSchema = z.enum(["normal", "italic", "oblique"]);
export const textAlignSchema = z.enum(["left", "center", "right", "justify"]);
export const textDecorationSchema = z.enum([
  "none",
  "underline",
  "overline",
  "line-through",
]);
export const textTransformSchema = z.enum([
  "none",
  "capitalize",
  "uppercase",
  "lowercase",
]);
export const lineHeightSchema = z.enum([
  "normal",
  "1",
  "1.2",
  "1.4",
  "1.5",
  "1.6",
  "1.8",
  "2",
]);
export const letterSpacingSchema = z.enum([
  "normal",
  "0.5px",
  "1px",
  "1.5px",
  "2px",
  "-0.5px",
  "-1px",
]);

// Layout & Sizing schemas
export const displaySchema = z.enum([
  "block",
  "inline",
  "inline-block",
  "flex",
  "grid",
  "none",
]);
export const positionSchema = z.enum([
  "static",
  "relative",
  "absolute",
  "fixed",
  "sticky",
]);
export const overflowSchema = z.enum(["visible", "hidden", "scroll", "auto"]);

// Flexbox schemas
export const flexDirectionSchema = z.enum([
  "row",
  "column",
  "row-reverse",
  "column-reverse",
]);
export const flexWrapSchema = z.enum(["nowrap", "wrap", "wrap-reverse"]);
export const justifyContentSchema = z.enum([
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "space-evenly",
]);
export const alignItemsSchema = z.enum([
  "flex-start",
  "flex-end",
  "center",
  "baseline",
  "stretch",
]);
export const alignContentSchema = z.enum([
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "stretch",
]);

// Grid schemas
export const gridAutoFlowSchema = z.enum([
  "row",
  "column",
  "row dense",
  "column dense",
]);

// Border schemas
export const borderStyleSchema = z.enum([
  "none",
  "solid",
  "dashed",
  "dotted",
  "double",
]);

// Background schemas
export const backgroundSizeSchema = z.enum(["auto", "cover", "contain"]);
export const backgroundRepeatSchema = z.enum([
  "repeat",
  "no-repeat",
  "repeat-x",
  "repeat-y",
]);
export const backgroundPositionSchema = z.enum([
  "top",
  "bottom",
  "left",
  "right",
  "center",
  "top left",
  "top right",
  "bottom left",
  "bottom right",
]);

// Create a discriminated union for style properties and their allowed values
export const styleSchema = z.discriminatedUnion("property", [
  // Typography
  z.object({ property: z.literal("color"), value: z.string() }),
  z.object({ property: z.literal("fontFamily"), value: z.string() }),
  z.object({ property: z.literal("fontSize"), value: fontSizeSchema }),
  z.object({ property: z.literal("fontWeight"), value: fontWeightSchema }),
  z.object({ property: z.literal("fontStyle"), value: fontStyleSchema }),
  z.object({ property: z.literal("lineHeight"), value: lineHeightSchema }),
  z.object({
    property: z.literal("letterSpacing"),
    value: letterSpacingSchema,
  }),
  z.object({ property: z.literal("textAlign"), value: textAlignSchema }),
  z.object({
    property: z.literal("textDecoration"),
    value: textDecorationSchema,
  }),
  z.object({
    property: z.literal("textTransform"),
    value: textTransformSchema,
  }),

  // Layout & Sizing
  z.object({ property: z.literal("width"), value: z.string() }),
  z.object({ property: z.literal("height"), value: z.string() }),
  z.object({ property: z.literal("maxWidth"), value: z.string() }),
  z.object({ property: z.literal("maxHeight"), value: z.string() }),
  z.object({ property: z.literal("minWidth"), value: z.string() }),
  z.object({ property: z.literal("minHeight"), value: z.string() }),

  // Positioning
  z.object({ property: z.literal("position"), value: positionSchema }),
  z.object({ property: z.literal("top"), value: z.string() }),
  z.object({ property: z.literal("right"), value: z.string() }),
  z.object({ property: z.literal("bottom"), value: z.string() }),
  z.object({ property: z.literal("left"), value: z.string() }),
  z.object({ property: z.literal("zIndex"), value: z.string() }),

  // Margins & Padding
  z.object({ property: z.literal("margin"), value: z.string() }),
  z.object({ property: z.literal("marginTop"), value: z.string() }),
  z.object({ property: z.literal("marginRight"), value: z.string() }),
  z.object({ property: z.literal("marginBottom"), value: z.string() }),
  z.object({ property: z.literal("marginLeft"), value: z.string() }),
  z.object({ property: z.literal("padding"), value: z.string() }),
  z.object({ property: z.literal("paddingTop"), value: z.string() }),
  z.object({ property: z.literal("paddingRight"), value: z.string() }),
  z.object({ property: z.literal("paddingBottom"), value: z.string() }),
  z.object({ property: z.literal("paddingLeft"), value: z.string() }),

  // Borders
  z.object({ property: z.literal("border"), value: z.string() }),
  z.object({ property: z.literal("borderColor"), value: z.string() }),
  z.object({ property: z.literal("borderStyle"), value: borderStyleSchema }),
  z.object({ property: z.literal("borderWidth"), value: z.string() }),
  z.object({ property: z.literal("borderRadius"), value: z.string() }),
  z.object({ property: z.literal("borderTop"), value: z.string() }),
  z.object({ property: z.literal("borderRight"), value: z.string() }),
  z.object({ property: z.literal("borderBottom"), value: z.string() }),
  z.object({ property: z.literal("borderLeft"), value: z.string() }),

  // Background
  z.object({ property: z.literal("background"), value: z.string() }),
  z.object({ property: z.literal("backgroundColor"), value: z.string() }),
  z.object({ property: z.literal("backgroundImage"), value: z.string() }),
  z.object({
    property: z.literal("backgroundSize"),
    value: backgroundSizeSchema,
  }),
  z.object({
    property: z.literal("backgroundPosition"),
    value: backgroundPositionSchema,
  }),
  z.object({
    property: z.literal("backgroundRepeat"),
    value: backgroundRepeatSchema,
  }),

  // Flexbox
  z.object({ property: z.literal("display"), value: displaySchema }),
  z.object({
    property: z.literal("flexDirection"),
    value: flexDirectionSchema,
  }),
  z.object({ property: z.literal("flexWrap"), value: flexWrapSchema }),
  z.object({
    property: z.literal("justifyContent"),
    value: justifyContentSchema,
  }),
  z.object({ property: z.literal("alignItems"), value: alignItemsSchema }),
  z.object({ property: z.literal("alignContent"), value: alignContentSchema }),
  z.object({ property: z.literal("flexGrow"), value: z.string() }),
  z.object({ property: z.literal("flexShrink"), value: z.string() }),
  z.object({ property: z.literal("flexBasis"), value: z.string() }),
  z.object({ property: z.literal("gap"), value: z.string() }),
  z.object({ property: z.literal("rowGap"), value: z.string() }),
  z.object({ property: z.literal("columnGap"), value: z.string() }),

  // Grid
  z.object({ property: z.literal("gridTemplateColumns"), value: z.string() }),
  z.object({ property: z.literal("gridTemplateRows"), value: z.string() }),
  z.object({ property: z.literal("gridColumn"), value: z.string() }),
  z.object({ property: z.literal("gridRow"), value: z.string() }),
  z.object({ property: z.literal("gridGap"), value: z.string() }),
  z.object({ property: z.literal("gridAutoFlow"), value: gridAutoFlowSchema }),

  // Other common properties
  z.object({ property: z.literal("opacity"), value: z.string() }),
  z.object({ property: z.literal("boxShadow"), value: z.string() }),
  z.object({ property: z.literal("transition"), value: z.string() }),
  z.object({ property: z.literal("transform"), value: z.string() }),
  z.object({ property: z.literal("overflow"), value: overflowSchema }),
  z.object({ property: z.literal("overflowX"), value: overflowSchema }),
  z.object({ property: z.literal("overflowY"), value: overflowSchema }),
  z.object({
    property: z.literal("cursor"),
    value: z.enum([
      "default",
      "pointer",
      "text",
      "move",
      "not-allowed",
      "grab",
      "grabbing",
    ]),
  }),
  z.object({
    property: z.literal("visibility"),
    value: z.enum(["visible", "hidden", "collapse"]),
  }),
  z.object({
    property: z.literal("whiteSpace"),
    value: z.enum(["normal", "nowrap", "pre", "pre-wrap", "pre-line"]),
  }),
  z.object({
    property: z.literal("verticalAlign"),
    value: z.enum([
      "baseline",
      "top",
      "middle",
      "bottom",
      "text-top",
      "text-bottom",
    ]),
  }),

  // Filter properties
  z.object({ property: z.literal("filter"), value: z.string() }),
  z.object({ property: z.literal("backdropFilter"), value: z.string() }),

  // Animation properties
  z.object({ property: z.literal("animation"), value: z.string() }),
  z.object({ property: z.literal("animationDuration"), value: z.string() }),
  z.object({
    property: z.literal("animationTimingFunction"),
    value: z.string(),
  }),
  z.object({ property: z.literal("animationDelay"), value: z.string() }),
  z.object({
    property: z.literal("animationIterationCount"),
    value: z.string(),
  }),
  z.object({
    property: z.literal("animationDirection"),
    value: z.enum(["normal", "reverse", "alternate", "alternate-reverse"]),
  }),
  z.object({
    property: z.literal("animationFillMode"),
    value: z.enum(["none", "forwards", "backwards", "both"]),
  }),
  z.object({
    property: z.literal("animationPlayState"),
    value: z.enum(["running", "paused"]),
  }),
]);
export const attributeNameSchema = z.enum([
  // Core attributes
  "id",
  "class",
  "title",
  "style",

  // Link attributes
  "href",
  "target",
  "rel",
  "download",

  // Image attributes
  "src",
  "alt",
  "width",
  "height",
  "loading",

  // Form attributes
  "type",
  "name",
  "value",
  "placeholder",
  "required",
  "disabled",
  "checked",
  "readonly",
  "autocomplete",

  // Input attributes
  "min",
  "max",
  "step",
  "pattern",
  "accept",

  // Table attributes
  "colspan",
  "rowspan",

  // ARIA attributes
  "role",
  "aria-label",
  "aria-hidden",
  "aria-expanded",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-labelledby",
  "aria-selected",

  // Event handlers
  "onClick",
  "onChange",
  "onFocus",
  "onBlur",
  "onSubmit",
  "onKeyDown",
  "onKeyUp",

  // Misc attributes
  "draggable",
  "tabindex",
  "contenteditable",
]);

// Create the attribute schema using the name schema
export const attributeSchema = z.object({
  name: attributeNameSchema,
  value: z.string(),
});

// For data attributes, create a separate schema
export const dataAttributeSchema = z.object({
  name: z.string().regex(/^data-/),
  value: z.string(),
});

// Combine them
export const combinedAttributeSchema = z.union([
  attributeSchema,
  dataAttributeSchema,
]);

// Export types
export type AttributeName = z.infer<typeof attributeNameSchema>;
export type AttributeEntry = z.infer<typeof combinedAttributeSchema>;

// Export type for StyleEntry
export type StyleEntry = z.infer<typeof styleSchema>;
