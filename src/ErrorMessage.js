export default function ErrorMessage({ errorMessage }) {
  return <p className="error">
    <span>⛔️{errorMessage}</span>
  </p>;
}
