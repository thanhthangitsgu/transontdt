import { Button, Dialog, DialogContent } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { ThesisType } from "../../utils/DataType";
import { WorkSheet, read, utils, writeFileXLSX } from 'xlsx';
import dayjs from "dayjs";

type props = {
    handleSubmit: Function,
    open: boolean,
    setOpen: Function,
    data: ThesisType[]
}

export default function ExportFile({ handleSubmit, open, setOpen, data }: props) {
    const [itemList, setItemList] = useState<{ id: string, name: string }[]>([]);
    const [rightList, setRightList] = useState<{ id: string, name: string }[]>([]);

    const defaultList = [
        {
            id: 'name',
            name: 'Tên đề tài',
        },
        {
            id: 'student_id',
            name: 'Mã sinh viên',
        },
        {
            id: 'student_name',
            name: 'Tên sinh viên',
        }, {
            id: 'lecturer_id',
            name: 'Mã giảng viên HD',
        }
        , {
            id: 'lecturer_name',
            name: 'Tên giảng viên HD',
        },
        {
            id: 'board_id',
            name: 'Mã thành viên hội đồng'
        },
        {
            id: 'board_name',
            name: 'Hội đồng'
        },
        {
            id: 'date',
            name: 'Ngày'
        },
        {
            id: 'time',
            name: 'Giờ'
        },
        {
            id: 'room',
            name: 'Phòng'
        }
    ];

    useEffect(() => {
        setItemList(defaultList)
    }, []);

    const handleDrop = (droppedItem: any) => {
        if (!droppedItem.destination) return;
        let updatedList = [...itemList];
        let rightUpdate = [...rightList]
        const [reorderedItem] = droppedItem.source.droppableId === 'list-container' ?
            updatedList.splice(droppedItem.source.index, 1) :
            rightUpdate.splice(droppedItem.source.index, 1);
        if (droppedItem.destination.droppableId === 'list-container') updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
        if (droppedItem.destination.droppableId === 'list-container-right') rightUpdate.splice(droppedItem.destination.index, 0, reorderedItem);
        console.log(droppedItem);
        setItemList(updatedList);
        setRightList(rightUpdate);
    };

    const exportFile = useCallback(() => {
        let printData = createDataFromList(data);
        const ws = utils.json_to_sheet(printData);
        let merge: any[] = [];
        for (let i = 0; i < printData.length; i++) {
            if (i % 3 === 1) {
                rightList.map((item, index) => {
                    if (item.id !== 'student_id' && item.id !== 'student_name' && item.id !== 'board_id' && item.id !== 'board_name') {
                        let stat = { s: { r: i, c: index }, e: { r: i + 2, c: index } }
                        merge.push(stat);
                    }
                })
            }
        }

        ws["!merges"] = merge;
        fixWidth(ws);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Data");
        let current = dayjs().unix();
        writeFileXLSX(wb, `thesis-list-${current}.xlsx`);
    }, [data, rightList]);

    function fixWidth(worksheet: WorkSheet) {
        const data = utils.sheet_to_json<any>(worksheet)
        const colLengths = Object.keys(data[0]).map((k) => k.toString().length)
        for (const d of data) {
            Object.values(d).forEach((element: any, index) => {
                const length = element.toString().length
                if (colLengths[index] < length) {
                    colLengths[index] = length
                }
            })
        };

        let index = rightList.findIndex((item) => item.id === 'name');
        colLengths[index] = 25;
        worksheet["!cols"] = colLengths.map((l) => {
            return {
                wch: l,
            }
        })
    }


    function createDataFromList(listThesis: ThesisType[]): any[] {
        let list: any[] = [];
        listThesis.map((item, index) => {
            item.board_id.map((board, index) => {
                let temp: any = {}
                rightList.map((field, ind) => {
                    switch (field.id) {
                        case 'name':
                            temp['Tên đề tài'] = index === 0 ? item.name : '';
                            break;
                        case 'student_id':
                            temp['Mã số sinh viên'] = item.student_id[index] ? item.student_id[index] : '';
                            break;
                        case 'student_name':
                            temp['Họ tên sinh viên'] = item.student_name[index] ? item.student_name[index] : '';
                            break;
                        case 'lecturer_id':
                            temp['Mã GVHD'] = index === 0 ? item.lecturer_id : '';
                            break;
                        case 'lecturer_name':
                            temp['Tên GVHD'] = index === 0 ? item.lecturer_name : '';
                            break;
                        case 'board_id':
                            temp['Mã thành viên hội đồng'] = board;
                            break;
                        case 'board_name':
                            temp['Hội đồng'] = item.board_name[index];
                            break;
                        case 'date':
                            temp['Ngày'] = index === 0 ? item.date : '';
                            break;
                        case 'time':
                            temp['Giờ'] = index === 0 ? item.time : '';
                            break;

                        case 'room':
                            temp['Phòng'] = index === 0 ? item.room : '';
                            break;
                    }
                })
                list.push(temp);
            })
        });
        return list;
    }

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth='sm'
            onClose={() => setOpen(false)}
        >
            <DialogContent>
                <div className="dialog-account--title">Export danh sách khóa luận</div>
                <div className="drop-container-multi mt-8">
                    <div className="flex gap-4 w-full">
                        <div className="w-1/2 font-semibold">Trường mặc định</div>
                        <div className="w-1/2 font-semibold">Trường cần xuất</div>
                    </div>
                    <DragDropContext onDragEnd={handleDrop}>
                        <div className="flex gap-8 w-full">
                            <Droppable droppableId="list-container">
                                {(provided) => (
                                    <div
                                        className="multi-drag"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {itemList.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        className="item-container"
                                                        ref={provided.innerRef}
                                                        {...provided.dragHandleProps}
                                                        {...provided.draggableProps}
                                                    >
                                                        {`${item.name}`}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            <Droppable droppableId="list-container-right">
                                {(provided) => (
                                    <div
                                        className="multi-drag"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {rightList.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        className="item-container"
                                                        ref={provided.innerRef}
                                                        {...provided.dragHandleProps}
                                                        {...provided.draggableProps}
                                                    >
                                                        {`${item.name}`}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                    </DragDropContext>
                </div>
                <div className="mt-4 w-full flex justify-end">
                    <Button onClick={exportFile}>Export</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}