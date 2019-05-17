export default function (){
  console.log('Content');
  chrome.runtime.onInstalled.addListener(function() {
    
    chrome.webNavigation.onCompleted.addListener(function() {
      alert("This is my favorite website!");
    }, {url: [{urlMatches : 'https://www.google.com/'}]});
    
    // var baseURL = 'http://example.com/';
    console.log( "Specific");
  });

}  

  //   chrome.contextMenus.create({
//     "id": "Ad block gob",
//     "title": "Sample extension",
//     "contexts": ["all"]
//   });

//   chrome.webNavigation.onCompleted.addListener(function() {
//     alert("This is my favorite website!");
// });

//   console.log(chrome.tabs.getCurrent());
// });
