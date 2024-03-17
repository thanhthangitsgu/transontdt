import { Box, Checkbox, IconButton, LinearProgress } from "@mui/material";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { ConfigColumn, Position } from "../../utils/DataType";

type props = {
    configWidth: number[],
    columns: ConfigColumn[],
    rows: ConfigColumn[][],
    isLoad: boolean,
    listDelete: any[],
    setListDelete: Function,
    listStatusCheck: boolean[],
    setListStatusCheck: Function,
    isCheckAll: boolean,
    setOpenPopupDeletes: Function,
    isCheck: boolean

}
export default function Table({ isCheck, configWidth, columns, rows, isLoad, listDelete, setListDelete, listStatusCheck, setListStatusCheck, isCheckAll, setOpenPopupDeletes }: props) {
    return (
        <div className="table">
            <TableHeader columns={columns} configWidth={configWidth} isCheckAll={isCheckAll} listDeletes={listDelete} setOpenPopupDeletes={setOpenPopupDeletes} />
            {isLoad && (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>)}
            <TableRow isCheck={isCheck} rows={rows} configWidth={configWidth} listDelete={listDelete} setListDelete={setListDelete} listStatusCheck={listStatusCheck} setListStatusCheck={setListStatusCheck} />
        </div>
    )
}