import CalendarEntry from "../../components/CalendarEntry/CalendarEntry";
import Search from "../../components/Search/Search";
import styles from "./Calendar.module.css";

const dummyData = [
  {
    id: 1,
    title: "title 1",
    description: "description 1",
    date: "date 1",
    img: "https://placehold.co/400x200",
  },
  {
    id: 2,
    title: "title 2",
    description: "description 2",
    date: "date 2",
    img: "https://placehold.co/400x200",
  },
  {
    id: 3,
    title: "title 3",
    description: "description 3",
    date: "date 3",
    img: "https://placehold.co/400x200",
  },
  {
    id: 4,
    title: "title 4",
    description: "description 4",
    date: "date 4",
    img: "https://placehold.co/400x200",
  },
  {
    id: 5,
    title: "title 5",
    description: "description 5",
    date: "date 5",
    img: "https://placehold.co/400x200",
  },
  {
    id: 6,
    title: "title 6",
    description: "description 6",
    date: "date 6",
    img: "https://placehold.co/400x200",
  },
];

const Calendar = () => {
  const getCalendar = () => {
    return dummyData.map((data) => {
      return <CalendarEntry key={data.id} data={data} />;
    });
  };

  return (
    <div>
      <h1>Calendar</h1>
      <Search />
      <div className={styles.calendar}>{getCalendar()}</div>
    </div>
  );
};

export default Calendar;
