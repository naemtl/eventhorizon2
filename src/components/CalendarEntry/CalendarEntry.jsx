import PropTypes from "prop-types";
import styles from "./CalendarEntry.module.css";

const CalendarEntry = ({ data }) => {
  return (
    <div className={styles["calendar-entry"]}>
      <img src={data.img} alt={data.title} />
      <h2>{data.title}</h2>
      <p>{data.description}</p>
      <p>{data.date}</p>
    </div>
  );
};

CalendarEntry.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    img: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    date: PropTypes.string,
  }).isRequired,
};

export default CalendarEntry;
