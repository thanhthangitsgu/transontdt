import { Checkbox } from "@mui/material"
import { Position } from "../../utils/DataType"
type props = {
    rows: Array<Array<any>>,
    configWidth: number[],
    listDelete: any[],
    setListDelete: Function,
    listStatusCheck: boolean[],
    setListStatusCheck: Function,
    isCheck: boolean
}
export default function TableRow({ rows, configWidth, listDelete, setListDelete, listStatusCheck, setListStatusCheck, isCheck }: props) {
    function checkRow(index: number): void {
        let temp = [...listStatusCheck];
        temp[index] = !temp[index];
        if (temp[index]) addDeletes(rows[index][0].element);
        else removeDeletes(rows[index][0].element);
        setListStatusCheck(temp);
    }

    function addDeletes(id: string): void {
        console.log('add');
        setListDelete(id, true);
    };

    function removeDeletes(id: string): void {
        setListDelete(id, false);
    }

    return (
        <div className="table-row">
            {rows.map((item, index) => {
                return <div className="row" key={index} style={{ backgroundColor: listStatusCheck[index] ? '#e3f2fd' : index % 2 ? '#f5f5f5' : '', borderBottom: listStatusCheck[index] ? '1px solid #bbdefb ' : '' }}>
                    {isCheck && (<div style={{ width: `5%` }} className="table-cell"><Checkbox checked={listStatusCheck[index] !== undefined ? listStatusCheck[index] : false} onChange={() => checkRow(index)} /></div>)}
                    {item.map((cell, index) =>
                        <div key={index} className="table-cell" style={{ width: `${configWidth[isCheck ? index + 1 : index]}%`, display: cell.position === Position.Center ? 'flex' : 'block', justifyContent: cell.position === Position.Center ? 'center' : 'flex-start' }} >{cell.element}</div>)}
                </div>
            })}
        </div>
    )
}

