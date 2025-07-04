import * as common from './common.js';

////////////////////上面的是公用的/////////////////////////


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {//地址栏输入的标题关键词的时候会打开书签夹里的网址，所以有必要这样移除，;点击书签文件夹的时候并不会chrome.tabs.onCreated，所以不用onCreated
	common.removeBoookmark(tab.url,common.lessTabsFolderID)
});


// ["current", "all", "show"].forEach(
//     function(actionName) {
//         chrome.contextMenus.create({
//             'id': actionName,//否则 Extensions using event pages must pass an id parameter to chrome.contextMenus.create
//             'title': chrome.i18n.getMessage(actionName),
//             "contexts": ["all"]
//         });
//         chrome.contextMenus.create({
//             'type': "separator"
//         })
//     }
// )


// chrome.contextMenus.onClicked.addListener(function(info, tab) {
//     if (info.menuItemId == 'current') {
//         common.dumpCurrentTab()
//     } else if (info.menuItemId == 'all') {
//         common.dumpAllTabs()
//     } else if (info.menuItemId== 'show') {
//         common.showDumpedTabs()
//     }
// })

