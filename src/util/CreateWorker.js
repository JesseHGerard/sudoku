export function CreateWorker(rawJs) {
  return new Worker(
    URL.createObjectURL(
      new Blob([rawJs], {
        type: "text/javascript"
      })
    )
  );
}
