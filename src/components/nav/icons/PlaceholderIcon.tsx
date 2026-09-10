import type { IconProps } from "../../../types.js"

export default function PlaceholderIcon({className}: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100"
      className={className}
    >
      <defs>
        <style>
          {`.cls-1{stroke:#fff;stroke-miterlimit:10;}`}
        </style>
      </defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1_copy" data-name="Layer 1 copy">
        <circle className="cls-1" cx="50" cy="50" r="50"/></g></g>
    </svg>
  )
}