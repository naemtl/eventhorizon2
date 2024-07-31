import styles from "./Search.module.css";
import { FaMagnifyingGlass } from "react-icons/fa6";

const Search = () => {
  return (
    <div className={styles.search}>
      <FaMagnifyingGlass />
      <input type="text" placeholder="Filter by title..." onChange={() => {}} />
    </div>
  );
};

export default Search;
