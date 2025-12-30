import { DataGrid } from "@mui/x-data-grid";
import { formatDateTime } from "../../utils/helpers/dateHelpers";
import { SURGERY_STATUSES } from "../../utils/helpers/constants";

const ScheduleTable = ({ rows = [], onRowClick, onStatusChange, statusOptions = SURGERY_STATUSES }) => {
  const clean = value => {
    if (!value) return "";
    const v = String(value).trim();
    return v.toLowerCase().includes("unknown") ? "" : v;
  };

  const getPatientDisplay = row => {
    const name =
      clean(row.patientName) ||
      clean(row.patient?.name) ||
      `${clean(row.patient?.firstName) || row.firstName || ""} ${clean(row.patient?.lastName) || row.lastName || ""}`.trim();
    const id = row.patientId || row.patient?.patientId || row.patient?.id || row.id || row.scheduleId;
    return name || id || "Unknown patient";
  };

  const getDoctorDisplay = row => {
    const name =
      clean(row.doctorName) ||
      clean(row.doctor?.name) ||
      `${clean(row.doctor?.firstName) || row.doctorFirstName || ""} ${clean(row.doctor?.lastName) || row.doctorLastName || ""}`.trim();
    const id = row.doctorId || row.doctor?.doctorId || row.doctor?.id;
    return name || id || "Unknown doctor";
  };

  const getStartDisplay = row => {
    const start = row.scheduledStartTime || row.startTime || row.start || row.surgeryDate;
    const formatted = formatDateTime(start, "PP p");
    return formatted || "—";
  };

  const columns = [
    {
      field: "patientName",
      headerName: "Patient",
      flex: 1,
      renderCell: params => getPatientDisplay(params.row)
    },
    {
      field: "doctorName",
      headerName: "Doctor",
      flex: 1,
      renderCell: params => getDoctorDisplay(params.row)
    },
    { field: "otRoomNumber", headerName: "OT Room", width: 120 },
    {
      field: "scheduledStartTime",
      headerName: "Start",
      flex: 1,
      renderCell: params => getStartDisplay(params.row)
    },
    { field: "status", headerName: "Status", width: 130 },
    ...(onStatusChange
      ? [
          {
            field: "actions",
            headerName: "Update Status",
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: params => (
              <select
                defaultValue={params.row.status}
                className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark px-2 py-2 text-sm"
                onClick={e => e.stopPropagation()}
                onChange={e => {
                  e.stopPropagation();
                  onStatusChange(params.row, e.target.value);
                }}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            )
          }
        ]
      : [])
  ];

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        autoHeight
        rows={rows.map(r => ({ id: r.id || r.scheduleId, ...r }))}
        columns={columns}
        pageSizeOptions={[5, 10, 20, 100]}
        onRowClick={params => onRowClick?.(params.row)}
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default ScheduleTable;
