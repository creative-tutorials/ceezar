import type { SVGProps } from "react";
import type { JSX } from "react/jsx-runtime";

export const X = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg
    height="20"
    width="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16.82 20.768L3.753 3.968A.6.6 0 0 1 4.227 3h2.48a.6.6 0 0 1 .473.232l13.067 16.8a.6.6 0 0 1-.474.968h-2.48a.6.6 0 0 1-.473-.232Z" />
      <path d="M20 3L4 21" strokeLinecap="round" />
    </g>
  </svg>
);
