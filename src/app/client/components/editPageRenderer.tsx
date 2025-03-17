"use client";
import React, { useState, useCallback } from "react";
import {
  Element,
  Page,
  elementTypeSchema,
  elementSchema,
} from "../../../types/types";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "./ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  PlusCircle,
  Trash2,
  Move,
  Save,
  Eye,
  EyeOff,
  Settings,
  ArrowUpDown,
} from "lucide-react";

// Type for style and attribute properties
type Property = {
  name: string;
  value: string;
};

// Element editor modal component
const ElementEditor: React.FC<{
  element: any;
  onSave: (element: any) => void;
  onClose: () => void;
}> = ({ element, onSave, onClose }) => {
  const [editedElement, setEditedElement] = useState({ ...element });
  const [styles, setStyles] = useState<Property[]>(
    Array.isArray(element.styles)
      ? element.styles.map((s: any) => ({ name: s.property, value: s.value }))
      : []
  );
  const [attributes, setAttributes] = useState<Property[]>(
    Array.isArray(element.attributes)
      ? element.attributes.map((a: any) => ({ name: a.name, value: a.value }))
      : []
  );

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedElement({ ...editedElement, content: e.target.value });
  };

  // Handle type change
  const handleTypeChange = (type: string) => {
    setEditedElement({ ...editedElement, type });
  };

  // Handle style changes
  const handleStyleChange = (
    index: number,
    field: keyof Property,
    value: string
  ) => {
    const newStyles = [...styles];
    newStyles[index][field] = value;
    setStyles(newStyles);
  };

  // Add new style
  const addStyle = () => {
    setStyles([...styles, { name: "", value: "" }]);
  };

  // Remove style
  const removeStyle = (index: number) => {
    setStyles(styles.filter((_, i) => i !== index));
  };

  // Handle attribute changes
  const handleAttributeChange = (
    index: number,
    field: keyof Property,
    value: string
  ) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  // Add new attribute
  const addAttribute = () => {
    setAttributes([...attributes, { name: "", value: "" }]);
  };

  // Remove attribute
  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Convert properties to the format expected by the Element type
    const formattedStyles =
      styles.length > 0
        ? styles.map((style) => ({
            property: style.name,
            value: style.value,
          }))
        : null;

    const formattedAttributes =
      attributes.length > 0
        ? attributes.map((attr) => ({
            name: attr.name,
            value: attr.value,
          }))
        : null;

    const updatedElement = {
      ...editedElement,
      styles: formattedStyles,
      attributes: formattedAttributes,
    };

    onSave(updatedElement);
  };

  // Get available element types from the schema
  const elementTypes = Object.values(elementTypeSchema.enum);

  return (
    <AlertDialog open={true} onOpenChange={() => onClose()}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Element</AlertDialogTitle>
        </AlertDialogHeader>

        <Tabs defaultValue="general">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="styles">Styles</TabsTrigger>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="element-type">Element Type</Label>
              <Select
                value={editedElement.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger id="element-type">
                  <SelectValue placeholder="Select element type" />
                </SelectTrigger>
                <SelectContent>
                  {elementTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="element-content">Content</Label>
              <Textarea
                id="element-content"
                value={editedElement.content || ""}
                onChange={handleContentChange}
                placeholder="Element content"
                className="min-h-[100px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="styles" className="space-y-4 mt-4">
            {styles.map((style, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={style.name}
                  onChange={(e) =>
                    handleStyleChange(index, "name", e.target.value)
                  }
                  placeholder="Property (e.g., color)"
                  className="flex-1"
                />
                <Input
                  value={style.value}
                  onChange={(e) =>
                    handleStyleChange(index, "value", e.target.value)
                  }
                  placeholder="Value (e.g., #ff0000)"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStyle(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={addStyle} variant="outline" className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Style
            </Button>
          </TabsContent>

          <TabsContent value="attributes" className="space-y-4 mt-4">
            {attributes.map((attr, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={attr.name}
                  onChange={(e) =>
                    handleAttributeChange(index, "name", e.target.value)
                  }
                  placeholder="Name (e.g., href)"
                  className="flex-1"
                />
                <Input
                  value={attr.value}
                  onChange={(e) =>
                    handleAttributeChange(index, "value", e.target.value)
                  }
                  placeholder="Value (e.g., https://...)"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAttribute(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={addAttribute} variant="outline" className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Attribute
            </Button>
          </TabsContent>
        </Tabs>

        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Component to render a manipulatable element in edit mode
const EditableElement: React.FC<{
  element: any;
  index: number;
  path: number[];
  onSelect: (path: number[]) => void;
  isSelected: boolean;
  updateElement: (newElement: any, path: number[]) => void;
  deleteElement: (path: number[]) => void;
  moveElement: (path: number[], direction: "up" | "down") => void;
  addElement: (path: number[]) => void;
}> = ({
  element,
  index,
  path,
  onSelect,
  isSelected,
  updateElement,
  deleteElement,
  moveElement,
  addElement,
}) => {
  return (
    <div
      className={`relative group border-2 ${
        isSelected ? "border-blue-500" : "border-transparent"
      } hover:border-blue-300 my-2`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(path);
      }}
    >
      {/* Element controls */}
      <div
        className={`absolute top-0 right-0 bg-zinc-800 p-1 rounded shadow-md flex gap-1 z-10 ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            moveElement(path, "up");
          }}
          title="Move Up"
        >
          <ArrowUpDown className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            addElement(path);
          }}
          title="Add Child Element"
        >
          <PlusCircle className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            deleteElement(path);
          }}
          title="Delete Element"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Element type indicator */}
      <div
        className={`absolute top-0 left-0 bg-zinc-800 text-xs px-1 py-0.5 rounded z-10 ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        {element.type || "element"}
      </div>

      {/* The actual rendered element */}
      <div className="cursor-pointer min-h-[20px]">
        <ElementRenderer element={element} />
      </div>

      {/* Render children recursively */}
      {element.children && element.children.length > 0 && (
        <div className="pl-4 border-l border-gray-200">
          {element.children.map((child: any, childIndex: number) => (
            <EditableElement
              key={childIndex}
              element={child}
              index={childIndex}
              path={[...path, childIndex]}
              onSelect={onSelect}
              isSelected={false}
              updateElement={updateElement}
              deleteElement={deleteElement}
              moveElement={moveElement}
              addElement={addElement}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main page editor component
const PageEditor: React.FC<{
  page: Page;
  onSave: (updatedPage: Page) => void;
}> = ({ page, onSave }) => {
  const [workingPage, setWorkingPage] = useState<Page>({ ...page });
  const [selectedElementPath, setSelectedElementPath] = useState<
    number[] | null
  >(null);
  const [editorVisible, setEditorVisible] = useState(true);
  const [showEditorModal, setShowEditorModal] = useState(false);

  // Get selected element by path
  const getElementByPath = (elements: any[], path: number[]): any => {
    if (path.length === 0) return null;

    let currentElement = elements[path[0]];
    let currentPath = path.slice(1);

    while (currentPath.length > 0) {
      if (!currentElement.children) return currentElement;
      currentElement = currentElement.children[currentPath[0]];
      currentPath = currentPath.slice(1);
    }

    return currentElement;
  };

  // Set element at path in the workingPage
  const setElementAtPath = (
    elements: any[],
    path: number[],
    newElement: any
  ): any[] => {
    if (path.length === 0) return elements;

    const newElements = [...elements];

    if (path.length === 1) {
      newElements[path[0]] = newElement;
      return newElements;
    }

    const remainingPath = path.slice(1);
    const updatedElement = {
      ...newElements[path[0]],
      children: setElementAtPath(
        newElements[path[0]].children || [],
        remainingPath,
        newElement
      ),
    };

    newElements[path[0]] = updatedElement;
    return newElements;
  };

  // Delete element at path
  const deleteElementAtPath = (elements: any[], path: number[]): any[] => {
    if (path.length === 0) return elements;

    const newElements = [...elements];

    if (path.length === 1) {
      newElements.splice(path[0], 1);
      return newElements;
    }

    const remainingPath = path.slice(1);
    const parent = newElements[path[0]];

    const updatedChildren = deleteElementAtPath(
      parent.children || [],
      remainingPath
    );

    newElements[path[0]] = {
      ...parent,
      children: updatedChildren,
    };

    return newElements;
  };

  // Move element up or down at path
  const moveElementAtPath = (
    elements: any[],
    path: number[],
    direction: "up" | "down"
  ): any[] => {
    if (path.length === 0) return elements;

    const newElements = [...elements];

    if (path.length === 1) {
      const index = path[0];
      // Check boundaries
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === elements.length - 1)
      ) {
        return newElements;
      }

      const newIndex = direction === "up" ? index - 1 : index + 1;
      const element = newElements[index];

      // Remove element from old position
      newElements.splice(index, 1);
      // Insert element at new position
      newElements.splice(newIndex, 0, element);

      return newElements;
    }

    const remainingPath = path.slice(1);
    const parent = newElements[path[0]];

    const updatedChildren = moveElementAtPath(
      parent.children || [],
      remainingPath,
      direction
    );

    newElements[path[0]] = {
      ...parent,
      children: updatedChildren,
    };

    return newElements;
  };

  const addNewElement = (path: number[] | null) => {
    // Create a new element with compatible types
    const newElement = {
      type: "div",
      content: "New Element",
      styles: null, // Use null instead of empty array if that's what the type expects
      attributes: null, // Use null instead of empty array if that's what the type expects
      children: [],
    };

    if (!path) {
      // Add to root level - use type assertion to ensure compatibility
      setWorkingPage({
        ...workingPage,
        elements: [
          ...workingPage.elements,
          newElement,
        ] as typeof workingPage.elements,
      });
      return;
    }

    // Add as child to the selected element
    const parentElement = getElementByPath(workingPage.elements, path);
    if (!parentElement) return;

    const updatedParent = {
      ...parentElement,
      children: [...(parentElement.children || []), newElement],
    };

    updateElement(updatedParent, path);
  };

  // Update element
  const updateElement = useCallback(
    (newElement: any, path: number[]) => {
      if (!path) return;

      const newElements = setElementAtPath(
        workingPage.elements,
        path,
        newElement
      );
      setWorkingPage({
        ...workingPage,
        elements: newElements,
      });
    },
    [workingPage]
  );

  // Delete element
  const deleteElement = useCallback(
    (path: number[]) => {
      if (!path) return;

      const newElements = deleteElementAtPath(workingPage.elements, path);
      setWorkingPage({
        ...workingPage,
        elements: newElements,
      });

      // Deselect if the selected element was deleted
      if (
        selectedElementPath &&
        selectedElementPath.length >= path.length &&
        selectedElementPath
          .slice(0, path.length)
          .every((val, index) => val === path[index])
      ) {
        setSelectedElementPath(null);
      }
    },
    [workingPage, selectedElementPath]
  );

  // Move element
  const moveElement = useCallback(
    (path: number[], direction: "up" | "down") => {
      if (!path) return;

      const newElements = moveElementAtPath(
        workingPage.elements,
        path,
        direction
      );
      setWorkingPage({
        ...workingPage,
        elements: newElements,
      });

      // Update selected element path if it was moved
      if (
        selectedElementPath &&
        selectedElementPath.every((val, index) => val === path[index])
      ) {
        const newIndex =
          direction === "up"
            ? path[path.length - 1] - 1
            : path[path.length - 1] + 1;
        const newPath = [...path.slice(0, path.length - 1), newIndex];
        setSelectedElementPath(newPath);
      }
    },
    [workingPage, selectedElementPath]
  );

  // Handle element selection
  const handleSelectElement = (path: number[]) => {
    setSelectedElementPath(path);
    const selectedElement = getElementByPath(workingPage.elements, path);
    if (selectedElement) {
      setShowEditorModal(true);
    }
  };

  // Handle save changes to selected element
  const handleSaveElementChanges = (updatedElement: any) => {
    if (selectedElementPath) {
      updateElement(updatedElement, selectedElementPath);
    }
    setShowEditorModal(false);
  };

  // Handle save page
  const handleSavePage = () => {
    onSave(workingPage);
  };

  // Get the selected element for the editor
  const selectedElement = selectedElementPath
    ? getElementByPath(workingPage.elements, selectedElementPath)
    : null;

  return (
    <div className="flex h-screen">
      {/* Content panel */}
      <div
        className={`flex-1 overflow-y-auto ${
          editorVisible ? "pl-4" : "pl-0"
        } p-4`}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex w-full justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setEditorVisible(!editorVisible)}
            >
              {editorVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Settings className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {workingPage.elements.map((element, index) => (
          <EditableElement
            key={index}
            element={element}
            index={index}
            path={[index]}
            onSelect={handleSelectElement}
            isSelected={
              selectedElementPath && selectedElementPath[0] === index
                ? true
                : false
            }
            updateElement={updateElement}
            deleteElement={deleteElement}
            moveElement={moveElement}
            addElement={addNewElement}
          />
        ))}

        {workingPage.elements.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No elements yet. Add an element to get started.
          </div>
        )}
      </div>

      {/* Element editor modal */}
      {showEditorModal && selectedElement && (
        <ElementEditor
          element={selectedElement}
          onSave={handleSaveElementChanges}
          onClose={() => setShowEditorModal(false)}
        />
      )}
      {/* Editor panel */}
      {editorVisible && (
        <div className="w-64 p-4 overflow-y-auto flex flex-col h-full">
          <h2 className="text-lg font-semibold mb-4">Page Editor</h2>

          <div className="flex flex-col gap-2 mb-4">
            <Button onClick={() => addNewElement(null)} className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Element
            </Button>

            <Button onClick={handleSavePage} className="w-full">
              <Save className="h-4 w-4 mr-2" /> Save Page
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <h3 className="text-sm font-medium mb-2">Page Info</h3>
            <div className="space-y-2 mb-4">
              <div>
                <Label htmlFor="page-title">Title</Label>
                <Input
                  id="page-title"
                  value={workingPage.metadata.title}
                  onChange={(e) =>
                    setWorkingPage({
                      ...workingPage,
                      metadata: {
                        ...workingPage.metadata,
                        title: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="page-description">Description</Label>
                <Textarea
                  id="page-description"
                  value={workingPage.metadata.description}
                  onChange={(e) =>
                    setWorkingPage({
                      ...workingPage,
                      metadata: {
                        ...workingPage.metadata,
                        description: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="page-route">Route</Label>
                <Input
                  id="page-route"
                  value={workingPage.route}
                  onChange={(e) =>
                    setWorkingPage({
                      ...workingPage,
                      route: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="page-status">Status</Label>
                <Select
                  value={workingPage.status}
                  onValueChange={(value) =>
                    setWorkingPage({
                      ...workingPage,
                      status: value as "draft" | "published" | "archived",
                    })
                  }
                >
                  <SelectTrigger id="page-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import ElementRenderer from "../../server/components/elementRenderer";

export default PageEditor;
