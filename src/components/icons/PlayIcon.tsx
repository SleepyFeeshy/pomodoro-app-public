import type { IconProps } from "../../types.js"

export default function PlayIcon({className}: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 200"
      className={className}
    >
      <defs>
        <style>
          {`.cls-1{stroke:#fff;stroke-miterlimit:10;}`}
        </style>
      </defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1_copy" data-name="Layer 1 copy">
        <path d="M175.4,91.5L47.5,17.7c-4.7-2.8-10.7-1.1-13.5,3.6c-0.8,1.5-1.3,3.2-1.3,4.9v147.7c0,5.4,4.4,9.9,9.9,9.8
	                c1.8,0,3.4-0.5,4.9-1.3l127.9-73.9c4.7-2.8,6.3-8.8,3.6-13.5C178.1,93.6,176.9,92.3,175.4,91.5z"/></g></g>
    </svg>
  )
}