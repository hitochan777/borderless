<script>
  // FIXME: This should not be a component but HOC
  import { onMount } from "svelte";
  import { stores } from "@sapper/app";

  import firebase from "firebase/app";
  import "firebase/auth";
  const { session } = stores();

  import { setUser, setLoading } from "../stores/session.js";

  const ky = require("ky/umd").default;

  setUser($session.user);

  onMount(() => {
    firebase.auth().onAuthStateChanged(async user => {
      let waitLoading = Promise.resolve();
      if (user) {
        const token = await user.getIdToken();
        // FIXME: const csrfToken = getCookie("csrfToken");
        waitLoading = await ky.post("/login.json", { json: { token } });
        setUser(user);
      }
      await waitLoading;
      setLoading(false);
    });
  });
</script>

<slot />
