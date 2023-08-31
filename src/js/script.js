window.addEventListener('DOMContentLoaded', (event) => {
    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Error ocurred.\n${url} could not fetch data.\n Status: ${res.status}`);
        }

        return await res.json();
    };

    getResource('http://localhost:3000/latest').then((data) => {
        document.querySelector('.latest-liked').insertAdjacentHTML('beforeend', data[0]);
    });
});
