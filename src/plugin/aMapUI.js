export default function MapUILoader(key) {
  const mp = new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
    } else {
      var script = document.createElement('script')
      const key = 'ca549d915cb38803582ca7e85c5f972c'
      script.type = 'text/javascript'
      script.async = true
      script.src = 'http://webapi.amap.com/maps?v=1.3&callback=initAMap&key=' + key
      // script.src = '../utils/shangli/shangli.json'
      script.onerror = reject
      document.head.appendChild(script)
    }
    window.initAMap = () => {
      resolve(window.AMap)
    }
  })

  const mpUI = new Promise((resolve, reject) => {
    if (window.AMapUI) {
      resolve(window.AMapUI)
    } else {
      var scriptUI = document.createElement('script')
      scriptUI.type = 'text/javascript'
      scriptUI.src = 'http://webapi.amap.com/ui/1.1/main.js?v=1.1.1'
      scriptUI.onerror = reject

      scriptUI.onload = function (su) {
        resolve(window.AMapUI)
      };
      document.head.appendChild(scriptUI)
    }

  })

  return Promise.all([mp, mpUI])
    .then(function (result) {
      console.log(result);

      return result
    }).catch(e => {
      console.log(e);
    })
}
