document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;
    const totalPages = 3;

    const showPage = (pageNumber) => {
        const pages = document.querySelectorAll('.gallery-page');
        pages.forEach(page => page.style.display = 'none');
        document.getElementById(`page${pageNumber}`).style.display = 'block';
    };

    showPage(currentPage);

    document.getElementById('next').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
        }
    });

    document.getElementById('prev').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
        }
    });
});
