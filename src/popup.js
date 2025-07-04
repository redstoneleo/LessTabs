import * as common from './common.js';


let figcaptionList=document.querySelectorAll('figcaption');//不加分号就出问题
let actionNameList=["current", "all", "show"];
document.querySelectorAll('figure').forEach(//不以actionNameList来遍历是为了可以单独本js作module，那时没有figure，只有popup的时候才有
    function(figure,index) {
        
        let figcaption=figure.lastChild;
        figcaption.innerText=chrome.i18n.getMessage(actionNameList[index]);
        figure=figcaption.parentElement;

    if (figure.id == 'current') {
        figure.onclick=common.dumpCurrentTab
    } else if (figure.id == 'all') {
        figure.onclick=common.dumpAllTabs
    } else if (figure.id == 'show') {
        figure.onclick=common.showDumpedTabs
    }

    }
)
