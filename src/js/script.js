const dataBtn = document.querySelector('.data-btn');

dataBtn.addEventListener('click', (event) => {
    fetch('http://localhost:3000/producers')
        .then((data) => data.json())
        .then((result) => {
            for (res of result) {
                res.songsSources.forEach((item) => {
                    dataBtn.insertAdjacentHTML('afterend', `<div>${item}</div>`);
                });
            }
        });
});
