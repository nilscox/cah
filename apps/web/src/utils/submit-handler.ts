export function submitHandler(handler: (data: FormData) => void) {
  return (event: SubmitEvent) => {
    event.preventDefault();
    handler(new FormData(event.target as HTMLFormElement));
  };
}
