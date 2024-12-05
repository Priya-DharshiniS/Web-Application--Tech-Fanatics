let circularProgress = document.querySelector(".circular-progress"),
progressValue = document.querySelector(".progress-value");

let progressStartValue = 0,    
progressEndValue = 30,    
speed = 100;

let progress = setInterval(() => {
progressStartValue++;

progressValue.textContent = `${progressStartValue}%`
circularProgress.style.background = `conic-gradient(#7d2ae8 ${progressStartValue * 3.6}deg, #ededed 0deg)`

if(progressStartValue == progressEndValue){
    clearInterval(progress);
}    
}, speed);



//Profile Dropdown Js
function toggleDropdown() {
    var dropdown = document.getElementById("dropdown");
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
}

function updateProfilePicture(gender) {
    var userImage = document.getElementById("user-image");
    var imagePath;

    // Add more images for different genders as needed
    switch (gender) {
        case "girl":
            imagePath = "../images/profile.avif";
            break;
        case "boy":
            imagePath = "../images/boy.jfif";
            break;
        case "others":
            imagePath = "../images/cat.jfif";
            break;
        case "letter":
            imagePath = "../images/s.jfif";
            break;
        default:
            imagePath = "../images/noprofile.jfif"; // Default image if gender is not recognized
    }

    userImage.src = imagePath;
    toggleDropdown();
}
