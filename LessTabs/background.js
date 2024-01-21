chrome.bookmarks.search({ //拿到lessTabsFolderID,不存在就创建lessTabsFolder
    'title': 'LessTabs'
}, function(bookmarkTreeNodeList) {
    if (bookmarkTreeNodeList.length) { //空List的bool仍然true，bad，所以如此
        lessTabsFolderID = bookmarkTreeNodeList[0].id
    } else {
        chrome.bookmarks.create({
            'parentId': '1', // id for bookmark bar
            'index': 0, //The 0-based position of this node within its parent folder.
            'title': 'LessTabs'
        }, function(bookmarkTreeNode) {
            lessTabsFolderID = bookmarkTreeNode.id
        });
    }
})

function dumpTab(tab, index) {
    chrome.bookmarks.create({
        'parentId': lessTabsFolderID,
        'index': index, //The 0-based position of this node within its parent folder.
        'title': tab.title,
        'url': tab.url
    });
    chrome.tabs.remove(tab.id)//关闭标签
}


function dumpCurrentTab() {
    chrome.tabs.query({
            'active': true,
            'currentWindow': true
        } //chrome.tabs.getCurrent(function( tab) {---undefined if called from a non-tab context (for example, a background page or 【popup view】、context menu).，故如此
        ,
        function(tabs) {

            tabs.forEach(dumpTab)

        })
}

function dumpAllTabs() {
    chrome.tabs.query({
        'currentWindow': true,
    }, function(tabs) {
	    tabs.forEach(dumpTab)
	    showDumpedTabs()//可以防止chrome最后一个标签关闭则浏览器关闭的情况
    })
    
}

function showDumpedTabs() {
    chrome.tabs.create({
        'url': 'chrome://bookmarks/?id=' + lessTabsFolderID
        // 'url': 'LessTabs.html'//另取，不直接"default_popup":"LessTabs.html"是因为按住Ctrl的时候点击一个链接后popup马上就会关闭，再次打开链接需要多次点击popup
    }) //lessTabsFolderID也是str，所以不用转换

    // window.open('chrome://extensions/')
}


function removeBoookmark(url, folderID) {
    chrome.bookmarks.search({
        'url': url
    }, function(bookmarkTreeNodeList) {
        bookmarkTreeNodeList.forEach(
            function(bookmarkTreeNode) {
                if (bookmarkTreeNode.parentId == folderID) {
                    chrome.bookmarks.remove(bookmarkTreeNode.id)
                }
            }

        )
    })
}


////////////////////上面的是公用的/////////////////////////


figcaptionList=document.querySelectorAll('figcaption');//不加分号就出问题
actionNameList=["current", "all", "show"];
document.querySelectorAll('figure').forEach(//不以actionNameList来遍历是为了可以单独本js作module，那时没有figure，只有popup的时候才有
    function(figure,index) {
    	
    	figcaption=figure.lastChild;
		figcaption.innerText=chrome.i18n.getMessage(actionNameList[index]);
		figure=figcaption.parentElement;

    if (figure.id == 'current') {
        figure.onclick=dumpCurrentTab
    } else if (figure.id == 'all') {
        figure.onclick=dumpAllTabs
    } else if (figure.id == 'show') {
        figure.onclick=showDumpedTabs
    }

    }
)


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {//地址栏输入的标题关键词的时候会打开书签夹里的网址，所以有必要这样移除，;点击书签文件夹的时候并不会chrome.tabs.onCreated，所以不用onCreated
	removeBoookmark(tab.url,lessTabsFolderID)
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


chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == 'current') {
        dumpCurrentTab()
    } else if (info.menuItemId == 'all') {
        dumpAllTabs()
    } else if (info.menuItemId== 'show') {
        showDumpedTabs()
    }
})

