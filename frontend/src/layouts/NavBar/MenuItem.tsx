import SvgSource from "../../utils/SvgSource";
type MenuItem = {
    name: string,
    slug: string,
    icon: JSX.Element,
    index: number,
}
const MenuItem: Array<MenuItem> = [
    { name: 'Quản lí Tài khoản', slug: 'account', icon: SvgSource.ListAccount, index: 1 },
    // { name: 'Phân quyền', slug: 'role', icon: SvgSource.role, index: -1 },
    { name: 'Quản lí Sinh viên', slug: 'student', icon: SvgSource.StudentSVG, index: 8 },
    { name: 'Quản lí Giảng viên', slug: 'lecturer', icon: SvgSource.UserSVG, index: 4 },
    { name: 'Quản lí Phòng', slug: 'classroom', icon: SvgSource.ComputerSVG, index: 2 },
    { name: 'Quản lí Khóa luận', slug: 'thesis', icon: SvgSource.ProjectSVG, index: 11 },
    { name: 'Đăng xuất', slug: 'login', icon: SvgSource.LogoutSVG, index: 0 },
]

export default MenuItem;