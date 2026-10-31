import Link from "next/link";

export default function NotFound() {
  return <section className="hero"><h1>העמוד לא נמצא</h1><p className="intro">אפשר לחזור לדף הבית ולהמשיך משם.</p><Link className="button primary" href="/">חזרה לבית</Link></section>;
}
