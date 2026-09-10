import type { IconProps } from "../../../types.js"

export default function TimerIcon({className}: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
      className={className}
    >
      <defs>
        <style>
          {`.cls-1{stroke:#fff;stroke-miterlimit:10;}`}
        </style>
      </defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1_copy" data-name="Layer 1 copy">
        <path className="cls-1" d="M11.56,22.67A9.29,9.29,0,0,1,5,6.81a9.29,9.29,0,1,1,6.56,15.86Zm0-16.51a7.22,7.22,0,1,0,7.23,7.22A7.23,7.23,0,0,0,11.56,6.16Zm0,8.25a1,1,0,0,1-1-1V9.25a1,1,0,1,1,2.06,0v4.13A1,1,0,0,1,11.56,14.41Zm9.29-7.22a1,1,0,0,1-.73-.3L18.06,4.82a1,1,0,0,1,0-1.45,1,1,0,0,1,1.46,0l2.06,2.06a1,1,0,0,1-.73,1.76ZM13.63,3.06H9.5A1,1,0,0,1,9.5,1h4.13a1,1,0,0,1,0,2.06Z"/></g></g>
    </svg>
  )
}