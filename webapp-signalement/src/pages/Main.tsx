import { Link } from "react-router-dom";

export default function Main() {
  return (
    <div>
        <Link to="/tracking">
      <button className="btn">Suivre un signalement</button>
    </Link>
    <Link to="/report">
      <button className="btn">Faire un signalement</button>
    </Link>
    </div>
    
  )
}
