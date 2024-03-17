import { Outlet, useLocation, useParams, useSearchParams } from 'react-router-dom';
import Navbar from './layouts/NavBar';
import './styles/app.css'
import Header from './layouts/Header';
import { useEffect, useState } from 'react';
import ChangePassword from './components/ChangePassword';
import { ToastContainer } from 'react-toastify';
import Loading from './components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import AxiosAuth from './api/AxiosAuth';
import { AppDispatch, RootState } from './redux/store';
import AxiosClient from './api/AxiosClient';
import { setAuth } from './redux/store/AuthSlice';
import { LecturerType, PermissionRole } from './utils/DataType';
import { setProfle } from './redux/store/ProfileSlice';
import image from '../src/assets/images/lockpage.png'
import MenuItem from './layouts/NavBar/MenuItem';
import useGet from './hook/useGet';

export default function App() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  let auth = useSelector<RootState, number>(state => state.auth);
  let param = useLocation();
  const data = useGet(`permission-role/${auth}`, false);
  const [listPermission, setList] = useState<PermissionRole[]>([]);
  const [index, setIndex] = useState<number>(-1);

  useEffect(() => {
    let el = MenuItem.find((item) => `/${item.slug}` === param.pathname);
    if (!el) return;
    setIndex(el.index);
  }, [param, listPermission, auth]);

  function isShow(index: number): boolean {
    if (listPermission.length === 0) return true;
    if (auth < 1) return true;
    if (index === -1 && auth === 1) return true;
    if (index === 0) return true;
    for (let item of listPermission) {
      if (Math.ceil(item.permission_id / 4) === index) return true;
    }
    return false;
  }

  useEffect(() => {
    if (!data.response) return;
    let temp: any[] = data.response;
    let list: PermissionRole[] = [];
    temp.map((item) => {
      let permission_id = parseInt(item.permission_id);
      let role_id = parseInt(item.role_id);
      list.push({ permission_id, role_id });
    });

    setList(list);
  }, [data.response]);

  useEffect(() => {
    setIsLoad(true);
    AxiosAuth.get('profile').then((data) => {
      let profile = data?.data;
      if (profile && profile.id) {
        profile.role_id = parseInt(data.data.role_id);
        dispatch(setAuth(profile.role_id));

        let temp: LecturerType = {
          id: profile.id,
          lecturer_id: '',
          first_name: profile.email,
          last_name: '',
          email: profile.email,
          gender: '',
          birthday: '',
          address: '',
          phone: '',
          faculty_id: 0,
          is_delete: 0,
          created_at: '',
          updated_at: ''
        };

        dispatch(setProfle(temp));
        console.log(profile);

        if (profile.role_id === 3) {
          AxiosClient.get(`lecturers/${profile.id}`).then((student) => {
            let st: LecturerType = student.data.data;
            st.faculty_id = parseInt(student.data.data.faculty_id);
            dispatch(setProfle(st))
          }).finally(() => setIsLoad(false));
        } else setIsLoad(false);

      } else setIsLoad(false);
    }).catch((e) => {
      setIsLoad(false);
    })
  }, [])

  return (
    <div className='app flex'>
      {isLoad && (
        <div className="flex w-full h-screen items-center justify-center">
          <Loading />
        </div>
      )}

      {!isLoad && (auth > -1) && isShow(index) && (
        <>
          <ToastContainer />
          <ChangePassword />
          <Navbar isOpen={isOpen} />
          <div className={isOpen ? 'app-main app-main--open' : 'app-main'} style={{ width: isOpen ? '80%' : '92%' }}>
            <Header isOpen={isOpen} setIsOpen={setIsOpen} />
            <Outlet />
          </div>
        </>
      )}
      {!isLoad && (auth === -1) && (
        <div className='w-full h-screen flex items-center justify-center flex-col'>
          <div className='m-8 text-xl'>
            Vui lòng <span className='font-semibold text-[#1565c0] cursor-pointer' onClick={() => window.location.href = '/login'}>đăng nhập</span> để sử dụng các chức năng của hệ thống.
          </div>
          <div className='w-1/3'>
            <img src={image} alt="" />
          </div>
        </div>
      )}
      {!isLoad && !isShow(index) && (
        <div className='w-full h-screen flex items-center justify-center flex-col'>
          <div className='m-8 text-xl'>
            Bạn không có quyền truy cập trang này!
            <br></br>
            <span className='font-semibold text-[#1565c0] cursor-pointer' onClick={() => window.location.href = '/'}>Trở về</span>
          </div>
          <div className='w-1/3'>
            <img src={image} alt="" />
          </div>
        </div>
      )}
    </div >
  );
}