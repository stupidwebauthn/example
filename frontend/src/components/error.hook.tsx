import { Snippet } from "@nextui-org/react";
import { useCallback, useState } from "react";

export default function useError() {
  const [message, setMessage] = useState("");
  const clear = () => setMessage("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function read(err: any) {
    console.error(err);
    let msg: string;
    if (err instanceof Error) {
      msg = err.message;
    } else if (err instanceof Response) {
      msg = await err.text();
    } else if (typeof err === "string") {
      msg = err;
    } else {
      msg = "Unknown error: " + err;
    }
    window.umami?.track("error", { msg });
    setMessage(msg);
  }

  // First clears then runs fn with catch to read error
  function asyncOrCatch<V>(fn: () => Promise<V>) {
    clear();
    fn().catch(read);
  }

  const render = useCallback(() => {
    if (!message) return null;
    return (
      <Snippet
        symbol="Err:"
        size="sm"
        variant="flat"
        color="danger"
        classNames={{ pre: "whitespace-normal" }}
      >
        {message}
      </Snippet>
    );
  }, [message]);

  return {
    read,
    clear,
    render,
    asyncOrCatch,
  };
}
