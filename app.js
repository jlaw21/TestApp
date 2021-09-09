const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
        thingsShown.hidden = false;

    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
        thingsList.innerHTML = '';
        thingsShown.hidden = true;
    }
});

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');

const db = firebase.database();
let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {

    if (user) {

        // Database Reference
        //thingsRef = db.collection('things')

        createThing.onclick = () => {

            db.ref('users/').push({
                uid: user.uid,
                name: faker.commerce.productName()
            });
        }

        /*db.ref().on("value", function(snapshot) {
            console.log(snapshot.val());
        }, function (error){
            console.log("Error: "+ error.code);
        })*/

        let users = db.ref("users/");

        users.orderByKey().on("child_added", function(data){
            if(data.val().uid === user.uid){
                let li = document.createElement('li');
                li.textContent = data.val().name;
                thingsList.appendChild(li);
            }
        });





    } else {
        // Unsubscribe when the user signs out
        unsubscribe && unsubscribe();
    }
});