export function animateQueueWaitUntilNotVisible(id){
    let element = document.getElementById(id)
    let action = 1
    const interval = setInterval(()=>{
        let pxSize = parseInt(window.getComputedStyle(element).letterSpacing) || 0
        if (pxSize >= 5){
            action = -1
        }
        else if (pxSize <= 1){
            action = 1
        }
        element.style.letterSpacing = (pxSize + action) + "px"
        if (document.getElementById(id).style.display == "none"){
            clearInterval(interval);
            console.log("clearing interval")
        }
    }, 200)
}


