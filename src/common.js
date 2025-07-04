let lessTabsFolderID;

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



export { lessTabsFolderID, dumpCurrentTab, dumpAllTabs,showDumpedTabs, removeBoookmark };
