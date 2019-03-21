import { DataTable, DataTableWithSearch } from "@newamerica/data-table";
import { ChartContainer, Title, Source } from "@newamerica/meta";
import { CheckboxGroup } from "@newamerica/components";

// helpers
let pass = `<svg class="passfailcheck" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.33 13.75" style="fill: none; stroke: rgb(45, 187, 179); stroke-linecap: square; stroke-width: 4px; width: 15px; height: 15px;"><title>check-mark</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><polyline class="check-mark" points="3.53 6.9 7.07 10.26 13.79 3.54"></polyline></g></g></svg>`;
let fail = `<svg class="passfailcheck" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.32 13.32" style="fill: none; stroke: rgb(230, 92, 100); stroke-linecap: square; stroke-width: 3px; width: 15px; height: 15px;"><title>x-mark</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><line class="x-mark" x1="3.54" y1="3.54" x2="9.78" y2="9.78"></line><line class="x-mark" x1="9.78" y1="3.54" x2="3.54" y2="9.78"></line></g></g></svg>`;

// the actual render
export function RenderDataTable(container, data) {
  // XXX this assumes the first item has the same shape as every other
  let columns = Object.keys(data[0]);
  // columns = columns.filter(col_name => !COLUMN_BLACKLIST.includes(col_name));

  // console.log(columns);
  // let's create the actual columns we pass to react-table
  columns = columns.map((accessor, i) => {
    let Header = accessor.replace("/", " / ");
    let Cell = row => <div>{row.value}</div>;
    let filterMethod;
    let Filter;
    let sortMethod;
    let width = 100;
    let style = {};
    let filterable = false;

    if (accessor === "Name of Program") {
      width = 150;
    }
    if (accessor === "Brief Description") {
      width = 250;
    }
    if (accessor === "URL") {
      width = 50;
      Cell = row => (
        <div>
          <a href={row.value} target="_blank">
            Link
          </a>
        </div>
      );
    }
    // is it a checkbox one?
    if (i > 2) {
      Cell = PassFailCell;
      filterable = true;
      filterMethod = (filter, row) => {
        if (filter.value[filter.id] === false) {
          return true;
        }
        return row[filter.id];
      };

      Filter = ({ filter, onChange }) => {
        return (
          <CheckboxGroup
            options={[{ checked: filter, id: accessor }]}
            onChange={change => onChange(change)}
          />
        );
      };
    } // end checkbox one setup
    // return { accessor, Header, Cell, sortMethod, width, style };
    return {
      accessor,
      Header,
      Cell,
      sortMethod,
      width,
      style,
      filterMethod,
      Filter,
      filterable
    };
  }); // end columns map

  let table = (
    <DataTableWithSearch
      data={data}
      columns={columns}
      showPagination={true}
      resizable={false}
      paginate={false}
      showPagination={false}
      defaultPageSize={data.length}
      sortable={false}
      minRows={0}
    />
  );

  let wrapped_table = <ChartContainer>{table}</ChartContainer>;
  ReactDOM.render(wrapped_table, container);
}

let PassFailCell = row => {
  let mu = row.value === "x" ? { __html: pass } : { __html: "" };
  return (
    <div style={{ textAlign: "center" }}>
      <div dangerouslySetInnerHTML={mu} />
      {/*{row.value === "Pass" ? "✅" : "❌"}*/}
    </div>
  );
};
