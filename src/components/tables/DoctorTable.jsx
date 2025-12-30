import { DataGrid } from "@mui/x-data-grid";

const DoctorTable = ({ rows = [], onRowClick }) => {
  const columns = [
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "specialization", headerName: "Specialization", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "status", headerName: "Status", width: 120 }
  ];

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        autoHeight
        rows={rows.map(r => ({ id: r.id || r.doctorId, ...r }))}
        columns={columns}
        pageSizeOptions={[5, 10, 20, 100]}
        onRowClick={params => onRowClick?.(params.row)}
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default DoctorTable;
