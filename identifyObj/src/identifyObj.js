// tensor cocoSsd
let cocoModel;
// liveCam
let liveVideo = document.getElementById("webcam");
const liveBtn = document.getElementById("showLiveBtn");
const msgElem = document.getElementById("msg");
const liveViewElem = document.getElementById("liveView");

let detectResult = [];


const mediaConstraint = {
    video: true,
    audio: false,
}

const ckMediaDevice = async() => {
    if (!(navigator.mediaDevices)) {
        throw "No media device available.";
    }
    return true;    
}

const getLive = async () => {
    try {
        const mStream = await navigator.mediaDevices.getUserMedia(mediaConstraint);
        liveViewElem.classList.remove("hidden");
        liveBtn.classList.add("hidden");
        //msgElem.innerHTML = "load media stream";
        liveVideo.srcObject = mStream;
        liveVideo.addEventListener("loadeddata", detectFromLiveView);

    } catch (err)
    {
        msgElem.innerHTML = err;
        throw err;
    }
}

const detectFromLiveView = async() => {
   //msgElem.innerHTML = "detecting";
    try {
        detectResult.length = 0;
        detectResult = await cocoModel.detect(liveVideo,5,0.5);
        //msgElem.innerHTML = detectResult.length;

        // remove previous detected highlighter
        msgElem.innerHTML = liveViewElem.children.length;
        for (let i=2; i<liveViewElem.children.length; i++) {
            liveViewElem.removeChild(liveViewElem.children[i]);
        }

        // create high lighter
        detectResult.forEach(detectedObj => {
            const detectedObjBtn = document.createElement("div");
            detectedObjBtn.classList.add("objectBtn");

            const liveViewBounding = liveViewElem.getBoundingClientRect()

            //detectedObjBtn.style.left= `${liveViewBounding.left + window.scrollX +detectedObj.bbox[0]}px`;
            detectedObjBtn.style.left= `${detectedObj.bbox[0]}px`;
           // detectedObjBtn.style.top=`${liveViewBounding.top+ window.scrollY + detectedObj.bbox[1]}px`;
            detectedObjBtn.style.top=`${detectedObj.bbox[1]}px`;
            detectedObjBtn.style.width=`${detectedObj.bbox[2]}px`;
            detectedObjBtn.style.height=`${detectedObj.bbox[3]}px`;
            liveViewElem.appendChild(detectedObjBtn);

            let newMsg = document.createElement("p");
            newMsg.innerHTML = detectedObj.class + " " + detectedObj.bbox[0]+ " " + detectedObj.bbox[1]+ " " + detectedObj.bbox[2]+ " " + detectedObj.bbox[3];
            msgElem.appendChild(newMsg);
            //newMsg.innerHTML =  detectedObjBtn.style.left + " " + detectedObjBtn.style.top+ " " + detectedObjBtn.style.width+ " " + detectedObjBtn.style.height;
            //msgElem.appendChild(newMsg);
        });

    } catch (err)
    {
        msgElem.innerHTML = err;
        throw err;
    } 
    window.requestAnimationFrame(detectFromLiveView);   
}







// initialize
const initialize = async () => {
    msgElem.innerHTML = "initializing.....";
    try {
        await ckMediaDevice();
        cocoModel = await cocoSsd.load();
        msgElem.innerHTML = "cocoSsd loaded";
        // show live button
        
        liveBtn.addEventListener("click", getLive);

    } catch (err)
    {
        msgElem.innerHTML = err;
        throw err;
    }
}

initialize();