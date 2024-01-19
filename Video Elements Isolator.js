/*
  My GitHub : https://github.com/Mending-Electronics
  Author : Jallet Alexandre
  Version : 0.1


  Web Browser JavaScript snippet use to:
     - Isolate video elements
     - Remove basics no-Download protections
     - Add for each video's element isolated a Download button using the Bootstrap's framework from a CDN Link

  3 Paths to Download:
	> Right Click on the video and Save-As (if enabled)
	> Click on the Three dots menu and select "Save-As" (if enabled)
	> Click on the Download button below the video element (if enabled)

*/


// Create a new span element at the end of the body element
const newSpan = document.createElement('span');
document.body.appendChild(newSpan);

// Find the h1 element and copy it to the new span
const h1Element = document.querySelector('h1');
if (h1Element) {
  const newH1 = document.createElement('h1');
  newH1.textContent = h1Element.textContent;
  newSpan.appendChild(newH1);
}

// Select all video elements on the page
// const videos = document.querySelectorAll('video, iframe video');


// Find all video elements and copy them to the new span
const videoElements = document.querySelectorAll('video, iframe video');
if (videoElements.length > 0) {
  videoElements.forEach((videoElement) => {

    // Kill all events lisener to the assigned to the video element
    const clone = videoElement.cloneNode(true);
    videoElement.replaceWith(clone);
    
    // Remove the style attribute from each video element
    videoElement.removeAttribute('style');

    // Supprimez l'attribut playsinline
    videoElement.removeAttribute('playsinline');
        
    // Remove the controlslist attribute from each video element if it parametered on 'nodownload'
    videoElement.removeAttribute('controlslist');

    // Remove the Right-Click restriction on the video element
    videoElement.removeAttribute('oncontextmenu');   
      // add a mousedown event listener to the video element. 
      // When the user right-clicks on the video element, the event.button property will be equal to 2, 
      // which indicates a right-click event
    videoElement.addEventListener('mousedown', function(event) {
      if (event.button === 2) {
        event.preventDefault();
        videoElement.setAttribute('controls', '');
        videoElement.removeAttribute('controlsList');
      }
    });

    // Enables the “Save as” option
    videoElement.oncontextmenu = null;
    
    // Assign the new style by calling the .media css class
    videoElement.classList.add('media');

    // Add player controls
    videoElement.controls = true;
    
    // Add an attibut to show the cursor over the player if it was disabled
    videoElement.style.cursor = 'default';

    // Start loading the displayed videos
    videoElement.loading = "lazy";
    
    // Auto start video
    videoElement.autoplay = false;
    
    // Create a new div element to hold the video
    const newDiv = document.createElement('div');
    newDiv.classList.add('video-container');
    newSpan.appendChild(newDiv);

    // Add the video element to the new div
    newDiv.appendChild(videoElement);

    let videoSrc = "none"
    let newButton

    try {
      // // Add an event listener for the loadedmetadata event
      // videoElement.addEventListener('loadedmetadata', () => {

        // Get the src URL of the video element
        videoSrc = videoElement.src || videoElement.dataset.src || videoElement.querySelector('source').src;
        console.log(videoSrc);
      
      // });
    
      // Create a new button element to download the video
      newButton = document.createElement('button');
      newButton.classList.add('btn', 'btn-primary', 'btn-sm', 'btn-block');
      newButton.textContent = 'Download Video';
      newButton.title = videoSrc;
      newButton.addEventListener('click', () => {
        downloadVideo(videoSrc);
      });
    } catch (error) {
      console.log("Something wrong during the fetch source process.");
      // If videoSrc is "none", disable the button
      if (videoSrc === "none") {
          
        // Create a new disbled button element to download the video
        newButton = document.createElement('button');
        newButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'btn-block', 'disabled');
        newButton.textContent = 'Download Video';
      }
    }
    

    // Create a new div element to hold the download button
    const downloadDiv = document.createElement('div');
    downloadDiv.appendChild(newButton);
    newSpan.appendChild(downloadDiv);
    downloadDiv.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'mb-3', 'mt-1');
  });
} else {
  // If no video elements are found, add an h2 element with the text "No videos found 😢" to the new span
  const newH2 = document.createElement('h2');
  newH2.textContent = 'No videos found 😢';
  newSpan.appendChild(newH2);
}

// Remove all head elements
document.querySelectorAll('head link, head meta, head script, head style, head base').forEach((element) => {
  element.remove();
});

// Remove all body elements except the new span and the h1 element (if found)
document.querySelectorAll('body > :not(span):not(h1)').forEach((element) => {
  element.remove();
});

// Add a link element to call an online CSS store on CDN
const newLink = document.createElement('link');
newLink.rel = 'stylesheet';
newLink.type = 'text/css';
newLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.2/superhero/bootstrap.min.css';
document.head.appendChild(newLink);

// Add a style element and create a video element class to set a responsive height to 50% and add a body element class to center all elements in the page (h1, span, and video)
const newStyle = document.createElement('style');
newStyle.textContent = `

  video {
    height: auto !important;
    width: auto !important;
  }
  .video-container {
    position: relative;
    padding-bottom: 50%;
    height: 0;
    width: 600px;
  }
  .video-container .media {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;;
    height: 100% !important;;
  }
  .download-button {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;
document.head.appendChild(newStyle);

function downloadVideo(url) {
  console.log('Try to Download : ')
  console.log(url)
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function() {
    const urlCreator = window.URL || window.webkitURL;
    const videoUrl = urlCreator.createObjectURL(this.response);
    const tag = document.createElement('a');
    tag.href = videoUrl;
    tag.target = '_blank';
    tag.download = 'video.mp4';
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
  };
  xhr.onerror = function(err) {
    alert('Failed to download video');
  };
  xhr.send();
};


// try {
//   // If a div appears befor the span 'suspiccious cookies div' set a display none style to hide the div
//   const div = document.querySelector('div');
//   const span = document.querySelector('span');
//   if (div.compareDocumentPosition(span) & Node.DOCUMENT_POSITION_FOLLOWING) {
//     div.style.display = 'none';
//   };
//   } catch (error) {
//   console.log("Something wrong during the 'cookie' div research")
// };



videoElements.forEach((videoElement) => {
    // Start loading the displayed videos
    videoElement.loading = "lazy";
    
    // Auto start video
    videoElement.autoplay = true;
});

try {
  // Start video displayingans stop others
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play();
      } else {
        entry.target.pause();
      }
    });
  });
  
  videoElements.forEach(videoElement => {
    observer.observe(videoElement);
  });
} catch (error) {
  console.log("Something wrong during the initialisation of 'observer'")
};


// Patch the video style with an Event Listener if the Display size change
window.addEventListener('resize', function() {
    const video = document.querySelector('video');
    video.style.width = '100%';
    video.style.height = '100%';
    video.controls = true;
});
