

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


function generateBoookmarkListPage(folderID) {
    bookmarkSection = document.querySelector("ol")
    chrome.bookmarks.getChildren(folderID, function(bookmarkTreeNodeList) {
        listItemsHTML = ''
        bookmarkTreeNodeList.forEach(
            function(bookmarkTreeNode) {
                bookmarkUrl = bookmarkTreeNode.url
                bookmarkTitle = bookmarkTreeNode.title ||bookmarkUrl//没加载完的页面title为null,所以用url代替
                listItemsHTML += `<li><img src="cross.png" title="delete" id="deleteButton"><img src="chrome://favicon/${bookmarkUrl}"><a href="${bookmarkUrl}" target="_blank">${bookmarkTitle}</a></li>`
            }

        )

        bookmarkSection.innerHTML = listItemsHTML//很多书签的时候应该不会像一个一个添加那样断断续续添加体验不好吧，所以一次性搞定

        bookmarkSection.querySelectorAll("li").forEach( //chrome.bookmarks.getChildren的异步机制，所以要放在这里
            function(listItem) {
                listItem.onclick = function(event) {

                    bookmarkUrl = listItem.querySelector("a").href

                    //点击后的link都要去除收藏夹里的记录，尤其是用户执行删除操作的时候就要   找到后删除它
                    removeBoookmark(bookmarkUrl,lessTabsFolderID)
                    //之后page的更新交给bookmark相关的事件,都是重作page,下面有
                    
                }
            }
        )
    })

}




chrome.bookmarks.onCreated.addListener(function(id, bookmark) {
    generateBoookmarkListPage(lessTabsFolderID)
})

chrome.bookmarks.onRemoved.addListener(function(id, bookmark) {
    generateBoookmarkListPage(lessTabsFolderID)
})

chrome.bookmarks.onChanged.addListener(function(id, bookmark) {
    generateBoookmarkListPage(lessTabsFolderID)
})

chrome.bookmarks.onMoved.addListener(function(id, bookmark) {
    generateBoookmarkListPage(lessTabsFolderID)
})

window.addEventListener("load", function(event) { //The load event is fired when a resource and its dependent resources have finished loading.
    chrome.bookmarks.search({ //不存在就创建lessTabsFolder,并拿到lessTabsFolderID
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

        //必须放在这里，放在外面因为lessTabsFolderID还没有得到会出问题
        generateBoookmarkListPage(lessTabsFolderID);


        bookmarkManagerEntry=document.querySelector("#bookmarkManagerEntry")
        bookmarkManagerEntry.innerText =chrome.i18n.getMessage('bookmarkManagerEntryName')
        // bookmarkManagerEntry.href='chrome://bookmarks/?id='+lessTabsFolderID//不能用，因为chrome extension Not allowed to load local resource: chrome://bookmarks/  所以换成下面的方式
        bookmarkManagerEntry.onclick=function () {
            chrome.tabs.create({
                'url': 'chrome://bookmarks/?id='+lessTabsFolderID
            })
        }

        feedbackEntry=document.querySelector("#feedbackEntry")
        feedbackEntry.innerText =chrome.i18n.getMessage('feedbackEntryName')
        if (chrome.i18n.getUILanguage() == "zh-CN") {
            feedbackEntry.href = 'https://www.cnblogs.com/iMath/p/LessTabs.html'   
        } else {
            feedbackEntry.href = 'https://redstoneleo.blogspot.com/2019/12/LessTabs.html'
        }
        });



    })




