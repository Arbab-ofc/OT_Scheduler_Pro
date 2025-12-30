import { FiMenu } from "react-icons/fi";

const HamburgerMenu = ({ onClick }) => (
  <button aria-label="Open menu" className="p-2 rounded-full hover:bg-primary/10" onClick={onClick}>
    <FiMenu />
  </button>
);

export default HamburgerMenu;
