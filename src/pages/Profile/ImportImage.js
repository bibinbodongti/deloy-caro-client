import firebase from 'firebase';
const firebaseConfig = {
  apiKey: "AIzaSyB3C7OOUgjjxf7yvV9P6VbmtHmDGKVBCeA",
  authDomain: "stotepicture.firebaseapp.com",
  databaseURL: "https://stotepicture.firebaseio.com",
  projectId: "stotepicture",
  storageBucket: "stotepicture.appspot.com",
  messagingSenderId: "160343356649",
  appId: "1:160343356649:web:b433527c5cf3c68d46ac78",
  measurementId: "G-228F3ECR6Q"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

var selectedFile;

export default function getfile(file,setIsLoad,setSourceImage) {
  console.log(file);

  // selected file is that file which user chosen by html form 
  selectedFile = file[0];

  // make save button disabled for few seconds that has id='submit_link' 
  //document.getElementById('submit_link').setAttribute('disabled', 'true');
  return myfunction(setIsLoad,setSourceImage); // call below written function 
}

function myfunction(setIsLoad,setSourceImage) {
    return new Promise((resolve,reject)=>{
        // select unique name for everytime when image uploaded 
  // Date.now() is function that give current timestamp 
  var name = "123" + Date.now();

  // make ref to your firebase storage and select images folder 
  var storageRef = firebase.storage().ref('/images/' + name);

  // put file to firebase  
  var uploadTask = storageRef.put(selectedFile);

  // all working for progress bar that in html 
  // to indicate image uploading... report 
  uploadTask.on('state_changed', function (snapshot) {
    setIsLoad(true);
      switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
              console.log('Upload is paused');
              break;
          case firebase.storage.TaskState.RUNNING:
              console.log('Upload is running');
              break;
      }
  }, function (error) {
      console.log(error);
  }, function () {

      // get the uploaded image url back 
      uploadTask.snapshot.ref.getDownloadURL().then(
          function (downloadURL) {

              // You get your url from here 
              console.log('File available at', downloadURL);
              // document.getElementById('url').value = downloadURL;
              // $('#image').attr("src", downloadURL);

              // alert(document.getElementById('url').value);
              // print the image url 
              setIsLoad(false);
              setSourceImage(false);
              resolve(downloadURL);
              // document.getElementById('submit_link').removeAttribute('disabled');
          });
  });

    })
};


