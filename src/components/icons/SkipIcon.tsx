import type { IconProps } from "../../types.js"

export default function SkipIcon({className}: IconProps) {
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
        <path d="M135.3,88.3L23.8,24c-6.5-3.7-14.7-1.5-18.5,4.9c-1.2,2.1-1.8,4.4-1.8,6.7v128.7c0,7.5,6.1,13.5,13.5,13.5
	c2.4,0,4.7-0.6,6.7-1.8l111.4-64.4c6.5-3.7,8.7-12,5-18.4C139,91.2,137.3,89.5,135.3,88.3z"/>
        <path d="M171.4,22.2h14.1c6,0,10.9,4.9,10.9,10.9v133.8c0,6-4.9,10.9-10.9,10.9h-14.1c-6,0-10.9-4.9-10.9-10.9V33.1
	C160.5,27.1,165.4,22.2,171.4,22.2z"/></g></g>
    </svg>
  )
}