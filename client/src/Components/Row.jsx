import React from "react";

const Row = ({ children }) => {
  const childrens = React.Children.toArray(children);
  const s = childrens.length;
  return (
    <div style={{ height: "50%" }} className="flex justify-between gap-1">
      {childrens.map((child, ind) => {
        return (
          <div
            key={ind}
            style={{ width: `${100 / s}%` }}
            className="border-2 border-white border-r-5"
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default Row;
