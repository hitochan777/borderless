<script>
  import firebase from "firebase/app";
  import { stores } from "@sapper/app";
  const ky = require("ky/umd").default;

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

  export let segment;
</script>

<nav>
  <ul>
    <li>
      <a class={segment === undefined ? 'selected' : ''} href=".">home</a>
    </li>
    <li>
      <a class={segment === 'about' ? 'selected' : ''} href="about">about</a>
    </li>

    <!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
    <li>
      <a
        rel="prefetch"
        class={segment === 'blog' ? 'selected' : ''}
        href="blog">
        blog
      </a>
    </li>
    <li>
      {#if $session.user}
        <button on:click={handleSignOut}>Logout</button>
      {:else}
        <button on:click={handleSignIn}>Sign In</button>
      {/if}
    </li>
  </ul>
</nav>

<style>
  nav {
    border-bottom: 1px solid rgba(255, 62, 0, 0.1);
    font-weight: 300;
    padding: 0 1em;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  /* clearfix */
  ul::after {
    content: "";
    display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;
  }

  .selected {
    position: relative;
    display: inline-block;
  }

  .selected::after {
    position: absolute;
    content: "";
    width: calc(100% - 1em);
    height: 2px;
    background-color: rgb(255, 62, 0);
    display: block;
    bottom: -1px;
  }

  a {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
  }
</style>
