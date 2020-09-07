chrome.tabs.query({active: true, currentWindow: true}, tabs => process(tabs[0], document));

let service = null;

const process = (tab, document) => {
    const btn = document.querySelector('button');

    if (tab.url.includes('tinder.com')) {
        service = 'tinder';
        btn.disabled = false;
        setAvatar();
    } else if (tab.url.includes('badoo.com')) {
        service = 'badoo';
        btn.disabled = false;
    } else if (tab.url.includes('mamba.ru')) {
        service = 'mamba';
        btn.disabled = false;
    }
    else
        btn.disabled = true;
    
    btn.addEventListener('click', executeInPage);
};

    
const executeInPage = () => { 
    let i = setInterval(() => {
        chrome.tabs.executeScript({ code: '(' + modifyDOM + ')("' + service + '");' }, (res) => { 
            if (res === true)
                clearInterval(i);
        });
    }, 500);
}
const setAvatar = () => {
    chrome.tabs.executeScript({ 
        code: `
            document.querySelector('[aria-label="Profile Photo"]')?.style?.backgroundImage?.replace('url("','')?.replace('")', '')` 
        }, (res) => { if (res && res[0] && res[0].includes('https://')) document.querySelector('#avatar').src = res[0]; });
}

function modifyDOM(service) {
    let likeBtn = null;
    if (service === 'tinder')
        likeBtn = document.querySelector('.recsCardboard>div>div:nth-child(2)>div:nth-child(4)>button');
    // else if (service === 'badoo')
    //     likeBtn = document.querySelector('.recsCardboard>div>div:nth-child(2)>div:nth-child(4)>button');
    else if (service === 'mamba') {
        likeBtn = document.querySelector('div[data-name=like-action]') 
            || Array.from(document.querySelectorAll('button')).find(el => el.textContent === 'Not now');
    }

    likeBtn?.click(); 

    return likeBtn === null;
}