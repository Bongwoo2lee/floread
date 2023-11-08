import React, { useState, useEffect } from 'react';

function PageNavigation({ textPages }) {
    const [currentPage, setCurrentPage] = useState(0);

    const showPage = (pageIndex) => {
        setCurrentPage(pageIndex);
    };

    const prevPage = () => {
        if (currentPage > 0) {
            showPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < textPages.length - 1) {
            showPage(currentPage + 1);
        }
    };

    useEffect(() => {
        console.log(textPages, "ddd");
        showPage(0);
    }, [textPages]);

    return (
        <div>
            <div style={{ fontSize: '18px' }} dangerouslySetInnerHTML={{ __html: textPages[currentPage] }}></div>
            <button onClick={prevPage} disabled={currentPage === 0}>이전 페이지</button>
            <button onClick={nextPage} disabled={currentPage === textPages.length - 1}>다음 페이지</button>
        </div>
    );
}

export default PageNavigation;
