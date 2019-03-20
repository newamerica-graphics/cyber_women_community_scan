import { RenderDataTable } from "./render_datatable";

import "./index.scss";

let queue = [];
let data = null;

const settings = {
  community_scan_data_table: el => {
    // console.log(data);
    RenderDataTable(el, data["Sheet1"]);
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
