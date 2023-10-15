import "./pagenation.css";
const Pagenation = ({ pages, curentPage, setCurentPage }) => {
  const generatedPages = [];
  for (let i = 1; i <= pages; i++) {
    generatedPages.push(i);
  }
  return (
    <div className="pagenation">
      <button
        className="page previous"
        onClick={() => {
          setCurentPage((prev) => prev - 1);
        }}
        disabled={curentPage === 1}
      >
        Previous
      </button>
      {generatedPages.map((page) => (
        <div
          onClick={() => {
            setCurentPage(page);
          }}
          className={curentPage === page ? "page active" : "page"}
          key={page}
        >
          {page}
        </div>
      ))}
      <button
        className="page next"
        onClick={() => {
          setCurentPage((prev) => prev + 1);
        }}
        disabled={curentPage === pages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagenation;
