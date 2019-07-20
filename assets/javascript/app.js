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
var favortiteArray = ['manuel'];
var actualUserFav;

database.ref().on('value', function (snap) {
    var userRef;
    if (userLogged != undefined) {
        var howLong = userLogged.length;
        var userNumber = userLogged.charAt(howLong - 1);
        var userRef = 'User' + userNumber;
        var favRef = '/User' + userNumber + '/favorites';
        if (snap.child(favRef).exists()) {
            actualUserFav = snap.val()[userRef].favorites.favorite;
            actualUserFav = JSON.parse(actualUserFav);
        }
    }
    if (snap.child("/userAuth").exists()) {
        var currentid = snap.val().userAuth.userid;
        var currentpwd = snap.val().userAuth.userpwd;
        var howLong = currentid.length;
        var userNumber = currentid.charAt(howLong - 1)
        var userRef = 'User' + userNumber;
        var childRef = '/User' + userNumber;
        var favRef = childRef + '/favorites'

        if (snap.child(childRef).exists()) {
            idInDb = snap.val()[userRef].userid;
            pwdInDb = snap.val()[userRef].userpwd;
            if (currentid === idInDb) {
                console.log('Your id is good!')
                if (currentpwd === pwdInDb) {
                    console.log('Good to log!')
                    userLogged = idInDb;
                    alert(userLogged + " Has loged in to the webpage!");
                    $('#logbutton').hide();
                    $('#logform').hide();
                    $('#logout').show();
                    database.ref('/userAuth').set({})
                    isLogged = true;
                    if (snap.child(favRef).exists()) {
                        actualUserFav = snap.val()[userRef].favorites.favorite;
                        actualUserFav = JSON.parse(actualUserFav);
                    }
                    database.ref(childRef + '/isLogged').set({
                        isLogged: true
                    })
                }
                else {
                    alert('Incorrect password.')
                    $('#pwd-login').val('');
                }
            }
            else {
                alert('Incorrect ID.')
                $('#id-login').val('');
                $('#pwd-login').val('');
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
    event.preventDefault();
    var userid = $('#id-input').val().trim();
    var userpwd = $('#pwd-input').val().trim();
    if (userid != '' && userpwd != '') {
        userCount++;
        printID = userid + userCount;
        $('#id-input').val('');
        $('#pwd-input').val('');
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
    }
    else {
        alert('Input a valid userID/Pasword')
    }
})

$('#logbutton').on('click', function (event) {
    event.preventDefault();
    var logid = $('#id-login').val().trim();
    var logpwd = $('#pwd-login').val().trim();

    if (logid != '' && logpwd != '') {
        database.ref('/userAuth').set({
            userid: logid,
            userpwd: logpwd
        })
    }
    else {
        alert('Input a valid userID/Pasword')
    }
})

$('#logout').hide();
$('#logout').on('click', function () {
    $('#id-login').val('')
    $('#pwd-login').val('')
    actualUserFav = [];
    isLogged = false
    loggedRef = '/User' + userLogged.charAt(userLogged.length - 1) + '/isLogged';
    database.ref(loggedRef).set({
        isLogged: false
    })
    alert('User: ' + userLogged + ' has sign out.');
    userLogged = '';
    $('#logbutton').show();
    $('#logform').show();
    $('#logout').hide();
})

$('#favorite').on('click', function () {
    var howLong = userLogged.length;
    var userNumber = userLogged.charAt(howLong - 1);
    var userRef = '/User' + userNumber + '/favorites';

    database.ref(userRef).set({
        favorite: JSON.stringify(favortiteArray)
    })
})



