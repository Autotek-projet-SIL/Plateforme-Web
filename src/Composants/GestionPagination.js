import "./stylesheets/GestionPagination.css";
import "./stylesheets/bootsrapNeededStles.css";
import React, { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";

// Gestion de la pagination des differentes listes
export default function GestionPagination(props) {
  const [pageArray, setPageArray] = useState([]);

  useEffect(() => {
    var totPages = parseInt(props.totPages);
    var currentPage = parseInt(props.currentPage);
    var pageArr = [];
    if (totPages > 1) {
      if (totPages <= 9) {
        var i = 1;
        while (i <= totPages) {
          pageArr.push(i);
          i++;
        }
      } else {
        if (currentPage <= 5) pageArr = [1, 2, 3, 4, 5, 6, 7, 8, "", totPages];
        else if (totPages - currentPage <= 4)
          pageArr = [
            1,
            "",
            totPages - 7,
            totPages - 6,
            totPages - 5,
            totPages - 4,
            totPages - 3,
            totPages - 2,
            totPages - 1,
            totPages,
          ];
        else
          pageArr = [
            1,
            "",
            currentPage - 3,
            currentPage - 2,
            currentPage - 1,
            currentPage,
            currentPage + 1,
            currentPage + 2,
            currentPage + 3,
            "",
            totPages,
          ];
      }
    }
    setPageArray(pageArr);
  }, [props.totPages, props.currentPage]);
  function showChildren() {
    let array = [];
    let start = 0;
    if (props.currentPage === 1) {
      start = 0;
    } else {
      start = (props.currentPage - 1) * props.numItems;
    }
    let length = props.numItems;
    let theRange = Array.from({ length }, (_, idx) => idx + start);

    for (const key of theRange) {
      if (key <= props.children.length - 1) {
        array.push(props.children[key]);
      }
    }
    return array;
  }
  return (
    <>
      <div id="childrenContainer">{showChildren()}</div>
      <div id="paginationDiv">
        <Pagination id="pagination">
          {pageArray.map((ele, ind) => {
            const toReturn = [];

            if (ind === 0) {
              toReturn.push(
                <Pagination.First
                  key={"firstpage"}
                  disabled={props.currentPage === 1}
                  onClick={
                    props.currentPage === 1
                      ? () => {}
                      : () => {
                          props.pageClicked(1);
                        }
                  }
                />
              );

              toReturn.push(
                <Pagination.Prev
                  key={"prevpage"}
                  disabled={props.currentPage === 1}
                  onClick={
                    props.currentPage === 1
                      ? () => {}
                      : () => {
                          props.pageClicked(props.currentPage - 1);
                        }
                  }
                />
              );
            }

            if (ele === "") toReturn.push(<Pagination.Ellipsis key={ind} />);
            else
              toReturn.push(
                <Pagination.Item
                  key={ind}
                  active={props.currentPage === ele ? true : false}
                  onClick={
                    props.currentPage === ele
                      ? () => {}
                      : () => {
                          props.pageClicked(ele);
                        }
                  }
                >
                  {ele}
                </Pagination.Item>
              );

            if (ind === pageArray.length - 1) {
              toReturn.push(
                <Pagination.Next
                  key={"nextpage"}
                  disabled={props.currentPage === props.totPages}
                  onClick={
                    props.currentPage === ele
                      ? () => {}
                      : () => {
                          props.pageClicked(props.currentPage + 1);
                        }
                  }
                />
              );

              toReturn.push(
                <Pagination.Last
                  key={"lastpage"}
                  disabled={props.currentPage === props.totPages}
                  onClick={
                    props.currentPage === ele
                      ? () => {}
                      : () => {
                          props.pageClicked(ele);
                        }
                  }
                />
              );
            }
            return toReturn;
          })}
        </Pagination>
      </div>
    </>
  );
}
