
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { randomUUID } from 'crypto';
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 200, sortable: false },
    {
        field: 'email',
        headerName: 'Email',
        width: 200,
        sortable: false
    },
    {
        field: 'role',
        headerName: 'Chức vụ',
        width: 200,
        sortable: false
    },
    {
        field: 'action',
        headerName: 'Tác vụ',
        type: 'number',
        width: 110,
        sortable: false
    },
];

const rows = [
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
    { id: crypto.randomUUID(), email: 'thanhthang.itsgu@gmail.com', role: 'Sinh viên' },
];

export default function Table() {
    return (
        <div className="table">
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}

                checkboxSelection
                disableRowSelectionOnClick

            />
        </div>
    )
}

function uuidv4() {
    throw new Error('Function not implemented.');
}
