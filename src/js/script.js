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
        constructor(itemId, itemImage, itemName, itemCountry, itemGenres, itemTracks, itemSource) {
            this.itemId = itemId;
            this.itemImage = itemImage;
            this.itemName = itemName;
            this.itemCountry = itemCountry;
            this.itemGenres = itemGenres;
            this.itemTracks = itemTracks;
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

                    //

                    // this.itemTracks.forEach((item) => {
                    //     songsContainer.insertAdjacentHTML('beforeend', item);
                    // });

                    const scrollLoad = loadFrames(6, this.itemTracks, songsContainer);
                    scrollLoad();
                    window.addEventListener('scroll', (event) => {
                        if (window.scrollY + window.innerHeight === document.documentElement.scrollHeight) {
                            scrollLoad();
                        }
                    });
                }
            });
        }
    }

    creatorsButton.addEventListener('click', (event) => {
        if (creatorsButton.getAttribute('active') === 'true') {
            return false;
        } else {
            //loading animation start
            panelsWrapper.innerHTML = '';
            panelsWrapper.insertAdjacentHTML('afterbegin', `<div id="loading"><div></div></div>`);
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
                            item.pageLink
                        ).appendPanel();
                    });
                })
                .catch((err) => {
                    // loading animation delete
                    panelsWrapper.innerHTML = '';
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
            //loading circle
            minicardsList.insertAdjacentHTML('afterbegin', `<div id="loading"><div></div></div>`);
            getResource('http://localhost:3000/producers')
                .then((data) => {
                    minicardsList.innerHTML = '';
                    creatorsListButton.setAttribute('active', 'true');
                    data.forEach((item) => {
                        new CreatorCard(
                            item.id,
                            item.avatarSrc,
                            item.name,
                            item.country,
                            item.genres,
                            item.songsSources,
                            item.pageLink
                        ).appendMinicard();
                    });
                })
                .catch((err) => {
                    minicardsList.innerHTML = '';
                    songsContainer.innerHTML = `<p style="margin: 0 auto;color: red;text-align: center;">Something went wrong.</br> Please, try again later.</p>`;
                });
        }
    });

    //latest liked functionality

    const latestLikedButton = document.querySelector('[data-option = "likes"]'),
        latestLikedContainer = document.querySelector('.latest-liked');

    function loadFrames(numFrames, collection, container) {
        let totalSongsLoaded = 0;
        return () => {
            let i = 0;
            while (i < numFrames) {
                if (totalSongsLoaded === collection.length) {
                    break;
                }
                container.insertAdjacentHTML('beforeend', collection[totalSongsLoaded]);
                i++;
                totalSongsLoaded++;
            }
        };
    }

    latestLikedButton.addEventListener('click', (event) => {
        if (latestLikedButton.getAttribute('active') === 'true') {
            return false;
        } else {
            // loading animation start
            latestLikedContainer.insertAdjacentHTML('afterend', `<div id="loading"><div></div></div>`);
            getResource('http://localhost:3000/latest')
                .then((data) => {
                    document.querySelector('#loading').remove();
                    latestLikedButton.setAttribute('active', 'true');

                    const scrollLoad = loadFrames(6, data, latestLikedContainer);
                    scrollLoad();
                    window.addEventListener('scroll', (event) => {
                        if (window.scrollY + window.innerHeight === document.documentElement.scrollHeight) {
                            scrollLoad();
                        }
                    });
                    // data.forEach((item) => {
                    //     latestLikedContainer.insertAdjacentHTML('beforeend', item);
                    // });
                })
                .catch((err) => {
                    // loading animation delete
                    document.querySelector('#loading').remove();
                    latestLikedButton.setAttribute('active', 'false');
                    latestLikedContainer.insertAdjacentHTML(
                        'beforeend',
                        `<p style="margin: 0 auto;color: red;text-align: center;">Something went wrong.</br> Please, try again later.</p>`
                    );
                });
        }
    });

    //initializing click on latest liked to show content after page load
    latestLikedButton.click();
});
