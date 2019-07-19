var firebaseConfig = {
    apiKey: "AIzaSyDMa8F9axhjR2EACxjjPbjiVziH7gqfZjA",
    authDomain: "mydata-efc36.firebaseapp.com",
    databaseURL: "https://mydata-efc36.firebaseio.com",
    projectId: "mydata-efc36",
    storageBucket: "mydata-efc36.appspot.com",
    messagingSenderId: "233509212002",
    appId: "1:233509212002:web:2c66b91bda714330"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Create a variable to reference the database.
var database = firebase.database();
var userCount = 0;
var isLogged;
var userLogged;

database.ref().on('value', function (snap) {
    var userRef;
    if (snap.child("/userAuth").exists()) {
        console.log('Trying to log :D');

        var currentid = snap.val().userAuth.userid;
        var currentpwd = snap.val().userAuth.userpwd;
        var howLong = currentid.length;
        var userNumber = currentid.charAt(howLong - 1)
        var userRef = 'User' + userNumber;
        var childRef = '/User' + userNumber;
        if (snap.child(childRef).exists()) {

            idInDb = snap.val()[userRef].userid;
            pwdInDb = snap.val()[userRef].userpwd;
          

            if (currentid === idInDb) {
                console.log('Your id is good!')
                if (currentpwd === pwdInDb) {
                    console.log('Good to log!')
                    userLogged = idInDb;
                    alert(userLogged + " Has loged in to the webpage!")
                    database.ref('/userAuth').set({})
                    isLogged = true;
                    database.ref(childRef + '/isLogged').set({
                        isLogged: true
                    })
                }
                else {
                    alert('Incorrect password')
                }
            }
            else {
                alert('Incorrect ID.')
            }
        }
    }
})



database.ref('/userCount').on('value', function (snap) {
    if (snap.child("/userCount").exists()) {
        userCount = snap.val().userCount
    }
})

$('#submitbutton').on('click', function (event) {
    userCount++;
    event.preventDefault();
    var userid = $('#id-input').val();
    var userpwd = $('#pwd-input').val();
    printID = userid + userCount;
    console.log(printID);
    $('id-input').val('');
    $('pwd-input').val('');
    alert("Your generated user id is : " + printID + " , when you log in, you have to use this ID with your password!");

    database.ref('/userCount').set({
        userCount: userCount
    })

    var newUserRef = database.ref('/User' + userCount)
    userid = userid + userCount;
    newUserRef.set({
        userid: userid,
        userpwd: userpwd
    })

})

$('#logbutton').on('click', function () {
    var logid = $('#id-login').val()
    var logpwd = $('#pwd-login').val()
    console.log('Logid:', logid);
    console.log('Pwd:', logpwd);
    database.ref('/userAuth').set({
        userid: logid,
        userpwd: logpwd
    })
})

$('#logout').on('click', function() {
    isLogged = false
    loggedRef = '/User' + userLogged.charAt(userLogged.length-1) + '/isLogged';
    console.log(loggedRef);
    database.ref(loggedRef).set({
        isLogged: false
    })
    alert('User: ' + userLogged + ' has sign out.')
})

