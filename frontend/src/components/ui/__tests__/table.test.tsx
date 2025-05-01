import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../table";

describe("Table Components", () => {
  it("renders a basic table correctly", () => {
    render(
      <Table data-testid="table">
        <TableHeader data-testid="table-header">
          <TableRow data-testid="header-row">
            <TableHead data-testid="table-head-1">Name</TableHead>
            <TableHead data-testid="table-head-2">Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data-testid="table-body">
          <TableRow data-testid="body-row-1">
            <TableCell data-testid="table-cell-1">John Doe</TableCell>
            <TableCell data-testid="table-cell-2">john@example.com</TableCell>
          </TableRow>
          <TableRow data-testid="body-row-2">
            <TableCell data-testid="table-cell-3">Jane Smith</TableCell>
            <TableCell data-testid="table-cell-4">jane@example.com</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    // Check all elements render correctly
    expect(screen.getByTestId("table")).toBeInTheDocument();
    expect(screen.getByTestId("table-header")).toBeInTheDocument();
    expect(screen.getByTestId("header-row")).toBeInTheDocument();
    expect(screen.getByTestId("table-head-1")).toBeInTheDocument();
    expect(screen.getByTestId("table-head-2")).toBeInTheDocument();
    expect(screen.getByTestId("table-body")).toBeInTheDocument();
    expect(screen.getByTestId("body-row-1")).toBeInTheDocument();
    expect(screen.getByTestId("body-row-2")).toBeInTheDocument();
    expect(screen.getByTestId("table-cell-1")).toBeInTheDocument();
    expect(screen.getByTestId("table-cell-2")).toBeInTheDocument();
    expect(screen.getByTestId("table-cell-3")).toBeInTheDocument();
    expect(screen.getByTestId("table-cell-4")).toBeInTheDocument();

    // Check text content
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("applies custom classes to table components", () => {
    render(
      <Table className="custom-table-class" data-testid="table">
        <TableHeader className="custom-header-class" data-testid="table-header">
          <TableRow className="custom-row-class" data-testid="header-row">
            <TableHead className="custom-head-class" data-testid="table-head">
              Column
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="custom-body-class" data-testid="table-body">
          <TableRow className="custom-row-class" data-testid="body-row">
            <TableCell className="custom-cell-class" data-testid="table-cell">
              Cell Content
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    // Check custom classes are applied
    expect(screen.getByTestId("table")).toHaveClass("custom-table-class");
    expect(screen.getByTestId("table-header")).toHaveClass(
      "custom-header-class"
    );
    expect(screen.getByTestId("header-row")).toHaveClass("custom-row-class");
    expect(screen.getByTestId("table-head")).toHaveClass("custom-head-class");
    expect(screen.getByTestId("table-body")).toHaveClass("custom-body-class");
    expect(screen.getByTestId("body-row")).toHaveClass("custom-row-class");
    expect(screen.getByTestId("table-cell")).toHaveClass("custom-cell-class");
  });

  it("forwards ref to the underlying DOM elements", () => {
    const tableRef = React.createRef<HTMLTableElement>();
    const headerRef = React.createRef<HTMLTableSectionElement>();
    const bodyRef = React.createRef<HTMLTableSectionElement>();
    const rowRef = React.createRef<HTMLTableRowElement>();
    const headRef = React.createRef<HTMLTableCellElement>();
    const cellRef = React.createRef<HTMLTableCellElement>();

    render(
      <Table ref={tableRef} data-testid="table">
        <TableHeader ref={headerRef} data-testid="table-header">
          <TableRow ref={rowRef} data-testid="header-row">
            <TableHead ref={headRef} data-testid="table-head">
              Header
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody ref={bodyRef} data-testid="table-body">
          <TableRow data-testid="body-row">
            <TableCell ref={cellRef} data-testid="table-cell">
              Cell
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    // Check all refs are correctly attached to DOM elements
    expect(tableRef.current).not.toBeNull();
    expect(tableRef.current?.tagName).toBe("TABLE");

    expect(headerRef.current).not.toBeNull();
    expect(headerRef.current?.tagName).toBe("THEAD");

    expect(bodyRef.current).not.toBeNull();
    expect(bodyRef.current?.tagName).toBe("TBODY");

    expect(rowRef.current).not.toBeNull();
    expect(rowRef.current?.tagName).toBe("TR");

    expect(headRef.current).not.toBeNull();
    expect(headRef.current?.tagName).toBe("TH");

    expect(cellRef.current).not.toBeNull();
    expect(cellRef.current?.tagName).toBe("TD");
  });
});
