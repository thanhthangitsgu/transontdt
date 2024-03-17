import { useLocation } from "react-router-dom";
import MenuItem from "../layouts/NavBar/MenuItem";

const usePathName = () => {
    let defaultTitle: string = 'Trang Chủ';
    let slug = useLocation().pathname;
    let item = MenuItem.filter((item) => `/${item.slug}` === slug)[0];
    return item ? item.name : defaultTitle;
}
export default usePathName;