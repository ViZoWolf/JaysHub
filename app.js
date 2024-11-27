// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBW7P9X_xkHQY_ZfmBYs9OeMzspk-ksVpg",
    authDomain: "your-auth-domain.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "1:13113240872:web:41bf51a1cad9721f71341d"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const storage = firebase.storage();



// Upload Video Functionality
const uploadButton = document.getElementById("uploadButton");
const uploadStatus = document.getElementById("uploadStatus");

uploadButton.addEventListener("click", async () => {
    const videoFile = document.getElementById("videoFile").files[0];
    const videoTitle = document.getElementById("videoTitle").value;
    const videoDescription = document.getElementById("videoDescription").value;

    if (!videoFile || !videoTitle) {
        uploadStatus.textContent = "Please fill out all required fields!";
        uploadStatus.classList.add("error");
        return;
    }

    try {
        // Firebase Storage Reference
        const storageRef = firebase.storage().ref("videos/" + videoFile.name);

        // Upload file
        const uploadTask = storageRef.put(videoFile);

        uploadStatus.textContent = "Uploading...";

        uploadTask.on(
            "state_changed",
            null,
            (error) => {
                console.error(error);
                uploadStatus.textContent = "Error uploading video.";
                uploadStatus.classList.add("error");
            },
            async () => {
                // Get video URL after successful upload
                const videoURL = await storageRef.getDownloadURL();

                uploadStatus.textContent = "Upload successful!";
                uploadStatus.classList.remove("error");

                console.log("Video URL:", videoURL);
                // Add code here to save video metadata (title, description, URL) to a database
            }
        );
    } catch (error) {
        console.error("Upload failed:", error);
        uploadStatus.textContent = "An unexpected error occurred.";
        uploadStatus.classList.add("error");
    }
});

// Navigation for tabs
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        document.querySelectorAll(".tab-content").forEach(tab => {
            tab.style.display = tab.id === targetId ? "block" : "none";
        });
    });
});


// DOM Elements
const loginForm = document.getElementById("login-form");
const signUpForm = document.getElementById("sign-up-form");
const uploadPanel = document.getElementById("upload-panel");

// Show sign-up form
function showSignUp() {
    signUpForm.style.display = "block";
    loginForm.style.display = "none";
}

// Show sign-in form
function showSignIn() {
    signUpForm.style.display = "none";
    loginForm.style.display = "block";
}

// Sign in function
async function signIn() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert("Signed in successfully!");
        showUploadPanel();
    } catch (error) {
        alert(error.message);
    }
}

// Sign up function
async function signUp() {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    try {
        await auth.createUserWithEmailAndPassword(email, password);
        alert("Account created successfully!");
        showSignIn();
    } catch (error) {
        alert(error.message);
    }
}

// Show the upload panel when signed in
function showUploadPanel() {
    loginForm.style.display = "none";
    signUpForm.style.display = "none";
    uploadPanel.style.display = "block";
}

// Video upload function
async function uploadVideo() {
    const videoFile = document.getElementById("video-file").files[0];
    if (!videoFile) {
        alert("Please select a video to upload.");
        return;
    }

    const storageRef = storage.ref("videos/" + videoFile.name);
    const uploadTask = storageRef.put(videoFile);

    uploadTask.on(
        "state_changed",
        null,
        (error) => {
            console.error(error);
            alert("Error uploading video.");
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                uploadStatus.textContent = "Video uploaded successfully! URL: " + downloadURL;
            });
        }
    );
}
