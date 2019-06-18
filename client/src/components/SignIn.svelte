<script>
  import firebase from "firebase/app";
  import { stores } from "@sapper/app";

  const { session } = stores();

  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
      await ky.delete("/logout.json");
      $session.user = null;
    } catch (error) {
      console.log(error);
      console.error("Faild to sign out");
    }
  };

  const handleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithRedirect(provider);
    // FIXME: const csrfToken = getCookie("csrfToken");
  };
</script>

{#if $session.user}
  <button on:click={handleSignOut}>Sign Out</button>
{:else}
  <button on:click={handleSignIn}>Sign In With Google</button>
{/if}
