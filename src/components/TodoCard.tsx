export const TodoCard = ({ content }) => {
  const styles = {
    backgroundColor: "white",
    padding: "1rem",
    width: "100px",
    margin: "0 1rem 1rem 0",
  };
  return (
    <div>
      <h1>{content}</h1>
    </div>
  );
};
