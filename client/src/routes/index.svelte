<style>
	h1, figure, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	figure {
		margin: 0 0 1em 0;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<script>
import firebase from "firebase/app";
import "firebase/auth";


let isLoggedIn = false;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    isLoggedIn = true;
    // User is signed in and currentUser will no longer return null.
  } else {
    // No user is signed in.
  }
});


const handleSignOut = async () => {
  try {
    await firebase.auth().signOut();
    isLoggedIn = false
  } catch (error) {
    console.error("Faild to sign out")
  }
}

const provider = new firebase.auth.GoogleAuthProvider();
const handleSignIn = async () => {
  firebase.auth().signInWithRedirect(provider);
  try {
    const result = await firebase.auth().getRedirectResult()
    if (result.credential) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = result.credential.accessToken;
      console.log(token)
      // ...
    }
    // The signed-in user info.
    const user = result.user;
  } catch (error) {
    console.log(error)
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
  }
}


</script>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<h1>Great success!</h1>

<figure>
	<img alt='Borat' src='great-success.png'>
	<figcaption>HIGH FIVE!</figcaption>
</figure>

<p><strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong></p>
{#if isLoggedIn}
  <button on:click={handleSignOut}>Sign Out</button> 
{:else}
  <button on:click={handleSignIn}>Sign In With Google</button> 
{/if}
