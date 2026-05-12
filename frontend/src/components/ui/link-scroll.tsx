import {Link, LinkProps, useNavigate } from "@tanstack/react-router";
import React from "react";

export const LinkScroll: React.FC<LinkProps> = (props) => (
  <Link
    {...props}
    onClick={() => {
      window.scrollTo(0, 0);
    }}
  />
)

export function useNavigateScroll(...args: Parameters<typeof useNavigate>) {
  const navigate = useNavigate(...args);

  // The type of navigateArgs should be Parameters<typeof navigate>
  return ({...navigateArgs}: {[navigateArgs: string]: any}) => {
    window.scrollTo(0, 0);
    return navigate({...navigateArgs});
  };
}