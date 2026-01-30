{
  "rules": {
    ".read": true,
    ".write": true
  }
}

<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>

<script>
  // استبدل القيم بقيم مشروع Firebase الخاص بك
  const firebaseConfig = {
    apiKey: "AIzaSy...خاصتك...",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project",const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

    storageBucket: "your-project.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdefg"
  };

  // تهيئة Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
</script>
