<script>
  // FIXME: This should not be a component but HOC
  import { onMount } from "svelte";
  import { stores } from "@sapper/app";

  import firebase from "firebase/app";
  import "firebase/auth";

  const ky = require("ky/umd").default;

  const { session } = stores();

  onMount(() => {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken();
        // FIXME: const csrfToken = getCookie("csrfToken");
        await ky.post("/login.json", { json: { token } });
        $session.user = user;
      }
    });
  });
</script>

<slot />
