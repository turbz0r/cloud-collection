window.addEventListener('DOMContentLoaded', (event) => {
    // async fetching functionality

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Error ocurred.\n${url} could not fetch data.\n Status: ${res.status}`);
        }

        return await res.json();
    };

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
        panelsWrapper = document.querySelector('.creators-panels__wrapper'),
        minicardsList = document.querySelector('.artist-list__items');

    class CreatorCard {
        constructor(itemId, itemImage, itemName, itemCountry, itemGenres, itemTracks, itemSets, itemSource) {
            this.itemId = itemId;
            this.itemImage = itemImage;
            this.itemName = itemName;
            this.itemCountry = itemCountry;
            this.itemGenres = itemGenres;
            this.itemTracks = itemTracks;
            this.itemSets = itemSets;
            this.itemSource = itemSource;
        }

        appendPanel() {
            // loading animation delete
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

        appendMinicard() {
            const artistMinicard = document.createElement('li');
            artistMinicard.classList.add('artist-list__item');
            artistMinicard.setAttribute('data-producer-id', this.itemId);
            artistMinicard.innerHTML = `<img src="${this.itemImage}" alt="" />
            <p>${this.itemName}</p>`;
            minicardsList.append(artistMinicard);

            artistMinicard.addEventListener('click', (event) => {
                if (
                    artistMinicard.getAttribute('data-producer-id') ===
                    songsContainer.getAttribute('data-active-producer-id')
                ) {
                    return false;
                } else {
                    songsContainer.setAttribute('data-active-producer-id', this.itemId);
                    songsContainer.innerHTML = '';
                    this.itemTracks.forEach((item) => {
                        songsContainer.insertAdjacentHTML('beforeend', item);
                    });
                }
            });
        }
    }

    creatorsButton.addEventListener('click', (event) => {
        if (creatorsButton.getAttribute('active') === 'true') {
            return false;
        } else {
            // loading animation start
            getResource('http://localhost:3000/producers')
                .then((data) => {
                    creatorsButton.setAttribute('active', 'true');
                    panelsWrapper.innerHTML = '';
                    data.forEach((item) => {
                        new CreatorCard(
                            item.id,
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
                    // loading animation delete
                    creatorsButton.setAttribute('active', 'false');
                    panelsWrapper.innerHTML = `<p style="margin: 0 auto;color: red;text-align: center;">Something went wrong.</br> Please, try again later.</p>`;
                });
        }
    });

    //Choose music -> creator section functionality

    const creatorsListButton = document.querySelector('[data-option = "creators-list"]'),
        songsContainer = document.querySelector('.artist-music');

    creatorsListButton.addEventListener('click', (event) => {
        if (creatorsListButton.getAttribute('active') === 'true') {
            return false;
        } else {
            getResource('http://localhost:3000/producers')
                .then((data) => {
                    creatorsListButton.setAttribute('active', 'true');
                    data.forEach((item) => {
                        new CreatorCard(
                            item.id,
                            item.avatarSrc,
                            item.name,
                            item.country,
                            item.genres,
                            item.songsSources,
                            item.setsSources,
                            item.pageLink
                        ).appendMinicard();
                    });
                })
                .catch((err) => {
                    songsContainer.innerHTML = `<p style="margin: 0 auto;color: red;text-align: center;">Something went wrong.</br> Please, try again later.</p>`;
                });
        }
    });

    //latest liked functionality

    const latestLikedButton = document.querySelector('[data-option = "likes"]'),
        latestLikedContainer = document.querySelector('.latest-liked');

    let totalLikedLoaded = 0;
    function loadFrames(numFrames, collection, container) {
        let i = 0;
        while (i < numFrames) {
            if (totalLikedLoaded === collection.length) {
                break;
            }
            container.insertAdjacentHTML('beforeend', collection[totalLikedLoaded]);
            i++;
            totalLikedLoaded++;
        }
    }

    latestLikedButton.addEventListener('click', (event) => {
        if (latestLikedButton.getAttribute('active') === 'true') {
            return false;
        } else {
            // loading animation start
            getResource('http://localhost:3000/latest')
                .then((data) => {
                    latestLikedButton.setAttribute('active', 'true');
                    loadFrames(6, data, latestLikedContainer);
                    window.addEventListener('scroll', (event) => {
                        if (window.scrollY + window.innerHeight === document.documentElement.scrollHeight) {
                            loadFrames(6, data, latestLikedContainer);
                        }
                    });
                    // data.forEach((item) => {
                    //     latestLikedContainer.insertAdjacentHTML('beforeend', item);
                    // });
                })
                .catch((err) => {
                    // loading animation delete
                    latestLikedButton.setAttribute('active', 'false');
                    latestLikedContainer.insertAdjacentHTML(
                        'beforeend',
                        `<p style="margin: 0 auto;color: red;text-align: center;">Something went wrong.</br> Please, try again later.</p>`
                    );
                });
        }
    });
});
