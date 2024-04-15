import React from "react";

const Row = ({ children }) => {
  const childrens = React.Children.toArray(children);
  const s = childrens.length;
  return (
    <div className="flex justify-between" >
      {childrens.map((child, ind) => {
        return (
          <div
            key={ind}
            style={{ width: `${100 / s}%` }}
            className="p-2 h-full"
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default Row;
