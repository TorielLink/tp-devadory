import styles from "./page.module.css";
import Login from "@/pages/login";
import SignUp from "@/pages/signUp";

export default function Home() {
  return (
    <div className={styles.page}>
      <SignUp/>
      <Login/>
    </div>
  );
}
