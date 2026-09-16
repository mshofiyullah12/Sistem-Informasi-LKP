/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

interface BarcodeProps {
  value: string;
  format?: "CODE128" | "CODE39" | "EAN13" | "UPC";
  width?: number;
  height?: number;
  displayValue?: boolean;
  fontSize?: number;
  margin?: number;
  background?: string;
  lineColor?: string;
  className?: string;
}

export default function Barcode({
  value,
  format = "CODE128",
  width = 1.2,
  height = 28,
  displayValue = false,
  fontSize = 9,
  margin = 0,
  background = "transparent",
  lineColor = "#0f172a",
  className = ""
}: BarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        // Clean value to alphanumeric or standard characters
        const safeValue = value.trim() || "0000000000";
        JsBarcode(svgRef.current, safeValue, {
          format: format,
          width: width,
          height: height,
          displayValue: displayValue,
          fontSize: fontSize,
          font: "monospace",
          textMargin: 1,
          margin: margin,
          background: background,
          lineColor: lineColor,
          valid: () => true
        });
      } catch (err) {
        console.warn("Barcode rendering fallback:", err);
      }
    }
  }, [value, format, width, height, displayValue, fontSize, margin, background, lineColor]);

  if (!value) return null;

  return (
    <svg 
      ref={svgRef} 
      className={className} 
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
}
