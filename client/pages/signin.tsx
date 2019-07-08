import { useStateValue } from "../store"

export default () => {
  const { actions } = useStateValue();
  return (
    <>
      <button onClick={() => actions.signIn()}>Sign in with Google</button>
    </>
  );
};
