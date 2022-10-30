createButton();
createStatsFrame();
applyStylesInIframe();
applyStylesInBody();

useMonkeyPatching();

function createButton() {
    const button = window.document.createElement('button');
    button.classList.add('open_stats_btn');
    button.textContent = 'Show Stats';
    button.addEventListener('click', () => {
        const iframe = document.querySelector('.stats_iframe');
        if (iframe.style.display === 'block') {
            iframe.style.display = 'none';
            button.textContent = 'Show Stats';
        } else {
            iframe.style.display = 'block';
            button.textContent = 'Hide Stats';
        }
        showInfo();
    });
    window.document.body.appendChild(button);
}

function createStatsFrame() {
    const statsIframe = document.createElement('iframe');
    statsIframe.classList.add('stats_iframe');
    window.document.body.appendChild(statsIframe);
}

function applyStylesInIframe() {
    const iframeHead = window.document.querySelector('.stats_iframe').contentDocument.querySelector('head');
    const style = document.createElement('style');
    style.innerHTML = `
  .stats_iframe_content{
    padding:20px 40px;
  }
  table{
    table-layout: fixed;
    width: 100%;
  }
  table, th, td{
    border: 1px solid;
  }
  td, th{
    overflow-wrap: break-word;
    padding:5px 10px;
    vertical-align:top;
  }
  `;
    iframeHead.appendChild(style);
}
function applyStylesInBody() {
    const documentHead = window.document.querySelector('head');
    const style = document.createElement('style');
    style.innerHTML = `
  .open_stats_btn {
    position: fixed;
    bottom: 10%;
    right: 10%;
    z-index: 1001;
    display: inline-block;
    border-radius:10px;
    padding: 20px 50px!important;
    font-size: 22px!important;
    font-weight:bold!important;
    background-color:rgb(153, 190, 242)!important;
    color:black!important;
  }
  .stats_iframe{
    position: fixed;
    width: 90%;
    height: 70%;
    top: 5%;
    left: 5%;
    z-index: 1000;
    display: none;
    background-color:rgb(153, 190, 242);
    border:none;
    box-shadow: 0px 0px 200px 50px rgba(62, 62, 62, 0.722);
  }
  `;
    documentHead.appendChild(style);
}

function showInfo() {
    const iframeBody = window.document.querySelector('.stats_iframe').contentDocument.querySelector('body');
    iframeBody.innerHTML = '';
    const content = document.createElement('div');
    content.classList.add('stats_iframe_content');
    iframeBody.appendChild(content);

    const h2ForUnits = document.createElement('h2');
    h2ForUnits.textContent = 'Add Unit Info';
    content.appendChild(h2ForUnits);

    content.appendChild(createAddUnitInfoTable());

    const h2ForBidders = document.createElement('h2');
    h2ForBidders.textContent = 'Bidders Info';
    content.appendChild(h2ForBidders);

    content.appendChild(createBiddersInfoTable());
}

function createAddUnitInfoTable() {
    try {
        const table = document.createElement('table');
        table.classList.add('ad_units_table');

        table.appendChild(createFirstRow([
            createElement('Ad unit code (Prebid.js) '),
            createElement('Sizes (Prebid.js)'),
            createElement('Bidders (Prebid.js)'),
            createElement('Ad unit path (GPT)')
        ]));

        const googleTagSlots = window.googletag.pubads().getSlots();
        if (!googleTagSlots) { throw 'No googletag slots'; }

        googleTagSlots.forEach(el => {
            const unitCode = el.getSlotElementId() || 'No unit Code info';
            const unitPath = el.getAdUnitPath() || 'No unit path info';
            const unitSizes = el.getSizes();
            const uniqueSizes = unitSizes.map(el => {
                if (el.width && el.height) {
                    return `Width: ${el.width} | Height: ${el.height}`;
                }
                return el;
            }) || 'No sizes info';

            let uniqueBidders;
            if (window.pbjs) {
                const prebidUnit = window.pbjs.adUnits.find(obj => obj.code === unitCode || unitPath);
                if (prebidUnit) {
                    const unitBids = prebidUnit.bids;
                    uniqueBidders = [];
                    unitBids.forEach((bid) => {
                        if (!uniqueBidders.includes(bid.bidder)) {
                            uniqueBidders.push(bid.bidder);
                        }
                    });
                } else {
                    uniqueBidders = 'No Dibs Info';
                }
            } else {
                uniqueBidders = 'No pbjs Info';
            }

            table.appendChild(createRow([
                createElement(unitCode),
                createElement(uniqueSizes),
                createElement(uniqueBidders),
                createElement(unitPath)
            ]));
        });
        return table;
    } catch (er) {
        console.log(er);
        return createElement('No Info(');
    }
}

function createBiddersInfoTable() {
    try {
        const table = document.createElement('table');
        table.classList.add('bidders_table');
        table.appendChild(createFirstRow([
            createElement('Bidder name'),
            createElement('CPM'),
            createElement('Currency'),
            createElement('Size')
        ]));

        const allBidders = [];
        if (!window.pbjs && !window.owpbjs) { throw 'No pbjs Info'; }
        const bidResponses = window.pbjs && window.pbjs.getBidResponses() || window.owpbjs && window.owpbjs.getBidResponses() || {};
        for (const resp in bidResponses) {
            if (Object.prototype.hasOwnProperty.call(bidResponses, resp)) {
                bidResponses[resp].bids.forEach(bidder => {
                    allBidders.push(bidder);
                });
            }
        }
        allBidders.forEach(bidder => {
            const bidderName = bidder.bidder || 'No Name Info';
            const bidderCPM = bidder.cpm || 'No bidderCPM Info';
            const bidderCurrency = bidder.currency || 'No bidderCurrency Info';
            const bidderSize = bidder.size || 'No bidderSize Info';
            table.appendChild(createRow([
                createElement(bidderName),
                createElement(bidderCPM),
                createElement(bidderCurrency),
                createElement(bidderSize)
            ]));
        });
        if (allBidders.length) {
            return table;
        }
        return createElement('No Info(');
    } catch (er) {
        console.log(er);
        return createElement('No Info(');
    }
}

function createElement(el) {
    if (typeof el === 'object') {
        const ul = document.createElement('ul');
        ul.classList = 'stats_table_cell';
        el.forEach(el => {
            const li = document.createElement('li');
            li.textContent = el;
            ul.appendChild(li);
        });
        return ul;
    }
    const div = document.createElement('div');
    div.classList = 'stats_table_cell';
    div.textContent = el;
    return div;
}

function createRow(elements) {
    const tr = document.createElement('tr');
    elements.forEach(el => {
        const td = document.createElement('td');
        td.appendChild(el);
        tr.appendChild(td);
    });
    return tr;
}

function createFirstRow(elements) {
    const tr = document.createElement('tr');
    elements.forEach(el => {
        const td = document.createElement('th');
        td.appendChild(el);
        tr.appendChild(td);
    });
    return tr;
}

function useMonkeyPatching() {
    const { fetch: originalFetch } = window;

    window.fetch = async (...args) => {
        let [resource, config] = args;
        const apiURL = 'https://fast-ridge-06331.herokuapp.com/'
        originalFetch(apiURL+'fetch?url=' + resource)
        const response = await originalFetch(resource, config);

        return response;
    };
}
