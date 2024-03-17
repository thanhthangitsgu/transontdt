import { IconButton } from "@mui/material";
import { ConfigColumn, Position } from "../../utils/DataType"
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
type props = {
    columns: ConfigColumn[],
    configWidth: number[],
    isCheckAll: boolean,
    listDeletes: string[],
    setOpenPopupDeletes: Function
}
export default function TableHeader({ columns, configWidth, listDeletes, setOpenPopupDeletes }: props) {
    return (
        <div className="table-header">
            {columns.map((item, index) => {
                return (<div key={index} className="table-header__title flex" style={{ width: `${configWidth[index]}%`, justifyContent: item.position === Position.Center ? 'center' : 'flex-start' }}>
                    {listDeletes.length > 0 && index !== 0 ? '' : item.element}
                    {listDeletes.length > 0 && index === 1 ? `${listDeletes.length} hàng được chọn` : ''}
                </div>)
            })}
            {listDeletes.length > 0 && (<IconButton aria-label="delete" sx={{ color: 'white' }} onClick={() => setOpenPopupDeletes(true)}><DeleteRoundedIcon /></IconButton>)}
        </div>
    )
}