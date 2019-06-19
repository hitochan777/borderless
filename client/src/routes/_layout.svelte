<script>
  import Nav from "../components/Nav.svelte";
  import WithAuth from "../components/withAuth";

  export let segment;
</script>

<WithAuth>
  <Nav {segment} />
  <main>
    <slot />
  </main>
</WithAuth>

<style>
  main {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
