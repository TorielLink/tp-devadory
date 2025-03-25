import styles from "./page.module.css";
import Login from "@/app/auth/login/page";
import Register from "@/app/auth/register/page";

export default function Home() {
  return (
    <div className={styles.page}>
      <Register/>
      <Login/>
    </div>
  );
}
