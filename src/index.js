import { RenderDataTable } from "./render_datatable";

import "./index.scss";

let queue = [];
let data = null;

const settings = {
  community_scan_data_table: el => {
    // console.log(data);
    let sheet_data = data["Sheet1"];
    sheet_data = sheet_data.sort((a, b) => {
      //prettier-ignore
      if(a["Name of Program"] < b["Name of Program"]) { return -1; }
      //prettier-ignore
      if(a["Name of Program"] > b["Name of Program"]) { return 1; }
      return 0;
    });
    RenderDataTable(el, sheet_data);
    // use data
  }
};

let endpoint_url = `https://na-data-projects.s3.amazonaws.com/data/cyber/women_community_scan.json`;

fetch(endpoint_url)
  .then(response => response.json())
  .then(_data => {
    data = _data;
    for (let i = 0; i < queue.length; i++) queue[i]();
  });

window.renderDataViz = function(el) {
  let id = el.getAttribute("id");
  let chart = settings[id];
  if (!chart) return;

  if (data) {
    chart(el);
  } else {
    queue.push(() => chart(el));
  }
};
