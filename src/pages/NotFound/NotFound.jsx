import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <h1>404: Page Not Found</h1>
      <Link to="/">Return to the Calendar</Link>
    </div>
  );
};

export default NotFound;
