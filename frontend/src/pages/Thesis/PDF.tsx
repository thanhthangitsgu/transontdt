import { ReactNode, useRef } from 'react';
// import generatePDF from 'react-to-pdf';

type props = {
    child: ReactNode
}

const Table = ({ child }: props) => {
    const targetRef = useRef(null);
    return (
        <>
            {/* <button onClick={() => generatePDF(targetRef, { filename: 'page.pdf' })}>Download PDF</button> */}
            <div ref={targetRef} className='page-table mt-4' >
                {child}
            </div>
        </>

    )
}
export default Table;