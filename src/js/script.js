window.addEventListener('DOMContentLoaded', (event) => {
    // async fetching functionality

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

    // navigation-contentSections synergy

    const sectionsList = document.querySelectorAll('.main-section'),
        navigationOptions = document.querySelectorAll('.navigation-option');

    function markersReset() {
        for (let i = 0; i < navigationOptions.length; i++) {
            if (sectionsList[i].classList.contains('section-active')) {
                sectionsList[i].classList.remove('section-active');
            }
            if (navigationOptions[i].classList.contains('nav-active')) {
                navigationOptions[i].classList.remove('nav-active');
            }
        }
    }

    navigationOptions.forEach((item, index) => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({
                top: 80,
            });

            if (event.target.classList.contains('nav-active')) {
                return false;
            } else {
                markersReset();
                event.target.classList.add('nav-active');
                sectionsList[index].classList.add('section-active');
            }
        });
    });

    // Creators panels

    const creatorsButton = document.querySelector('[data-option = "creators-all"]'),
        panelsWrapper = document.querySelector('.creators-panels__wrapper');

    class CreatorCard {
        constructor(itemImage, itemName, itemCountry, itemGenres, itemTracks, itemSets, itemSource) {
            this.itemImage = itemImage;
            this.itemName = itemName;
            this.itemCountry = itemCountry;
            this.itemGenres = itemGenres;
            this.itemTracks = itemTracks;
            this.itemSets = itemSets;
            this.itemSource = itemSource;
        }

        appendPanel() {
            const panel = document.createElement('div');
            panel.classList.add('creator-panel');
            panel.innerHTML = `<div class="creator-panel__img"><img src="${this.itemImage}" alt="" /></div>
            <div class="creator-panel__details">
                <p>${this.itemName}</p>
                <ul>
                    <li>Country: ${this.itemCountry}</li>
                    <li>Genres: ${this.itemGenres.join(',')}</li>
                    <li>Total tracks: ${this.itemTracks.length}</li>
                    <li>Full sets: ${this.itemSets.length}</li>
                </ul>
                <a href="${this.itemSource}" target="_blank">Page on SoundCloud</a>
            </div>`;
            panelsWrapper.append(panel);
        }
    }

    creatorsButton.addEventListener('click', (event) => {
        if (creatorsButton.getAttribute('active') === 'true') {
            return false;
        } else {
            getResource('http://localhost:3000/producers')
                .then((data) => {
                    creatorsButton.setAttribute('active', 'true');
                    data.forEach((item) => {
                        new CreatorCard(
                            item.avatarSrc,
                            item.name,
                            item.country,
                            item.genres,
                            item.songsSources,
                            item.setsSources,
                            item.pageLink
                        ).appendPanel();
                    });
                })
                .catch((err) => {
                    creatorsButton.setAttribute('active', 'false');
                });
        }
    });
});
