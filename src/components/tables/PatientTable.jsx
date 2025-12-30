import { DataGrid } from "@mui/x-data-grid";
import { format } from "date-fns";

const PatientTable = ({ rows = [], onRowClick }) => {
  const columns = [
    { field: "patientId", headerName: "Patient ID", width: 140 },
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "phoneNumber", headerName: "Phone", flex: 1 },
    {
      field: "admissionDate",
      headerName: "Admission",
      flex: 1,
      valueFormatter: params => {
        const v = params?.value;
        if (!v) return "—";
        const d = v instanceof Date ? v : typeof v?.toDate === "function" ? v.toDate() : new Date(v);
        return Number.isNaN(d?.getTime()) ? "—" : format(d, "PP");
      }
    },
    { field: "status", headerName: "Status", width: 120 }
  ];

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        autoHeight
        rows={rows.map(r => ({ id: r.id || r.patientId, ...r }))}
        columns={columns}
        pageSizeOptions={[5, 10, 20, 100]}
        onRowClick={params => onRowClick?.(params.row)}
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default PatientTable;
