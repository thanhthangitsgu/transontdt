import { ReactElement, ReactNode } from "react"

export type Province = {
    name: string,
    full_name: string,
    name_en: string
    id: number,
    type: string,
    region_id: number
}

export type District = {
    full_name: string,
    id: number,
    name: string,
    name_en: string,
    type: string
}

export type Ward = {
    district_id: number,
    full_name: string,
    id: number,
    name: string,
    name_en: string,
    province_id: number,
    type: string;
}

export type SelectIDProvince = {
    province: number,
    district: number,
    ward: number,
}

export type TextAddress = {
    province: string,
    district: string,
    ward: string,
}

export type User = {
    LastName: string;
    FirstName: string;
    Gender: number;
    Province: string,
    District: string,
    Ward: string,
    Address: string,
    Email: string,
    Phone: string,
}

export enum HTTP {
    Get = 'GET',
    Post = 'POST',
    Delete = 'DELETE',
    PUT = 'PUT'
}

export enum Position {
    Right,
    Top,
    Center,
    Left,
    Bottom
}

export type ConfigColumn = {
    element: ReactNode,
    position: Position,
}

export type LecturerType = {
    id: string,
    lecturer_id: string,
    first_name: string,
    last_name: string,
    email: string,
    gender: string,
    birthday: string,
    address: string,
    phone: string,
    faculty_id: number,
    is_delete: number,
    created_at: string,
    updated_at: string
}

export type LecturerPost = {
    lecturer_id: string,
    first_name: string,
    last_name: string,
    email: string,
    gender: string,
    birthday: string,
    address: string,
    phone: string,
    faculty: string
}

export type LecturerValidate = {
    lecturer_id: boolean,
    first_name: boolean,
    last_name: boolean,
    email: boolean,
    gender: boolean,
    birthday: boolean,
    address: boolean,
    phone: boolean,
    faculty: boolean,
}

export type StudentType = {
    id: string,
    student_id: string,
    first_name: string,
    last_name: string,
    email: string,
    gender: string,
    birthday: string,
    address: string,
    phone: string,
    major_id: number,
    faculty_id: number,
    created_at: string,
    updated_at: string,
    is_deleted: number
}

export type Week = {
    start_time: string,
    end_time: string,
    sequence: number,
    list_item: ItemSchedule[],
}

export type ItemSchedule = {
    lecturer_id: string,
    class_id: string,
    subject_id: string,
    room_id: string,
    datetime: string,
    day_of_week: number,
    start_lesson: number,
    total_lesson: number,
    group_id: string,
    pratice_id: string,
    credit: number,
    lecturer_name: string,
    subject_name: string,
}

export type RoleType = {
    id: number,
    name: string,
    is_deleted: number,
    create_at: string,
    update_at: string
}

export type FacultyType = {
    id: number,
    faculty_id: string,
    name: string,
    email: string | null,
    phone: string | null,
    is_delete: number,
    create_at: string,
    update_at: string,
}

export type MajorType = {
    id: number,
    major_id: string,
    faculty_id: number,
    name: string,
    is_delete: number,
    create_at: string,
    update_at: string,
}

export type ClassroomType = {
    id: number,
    label: string,
    capacity: number,
    is_computer_room: number,
    is_delete: number,
    created_at: string,
    updated_at: string,
}

export type SemesterType = {
    id: number,
    name: string,
    is_delete: number,
    created_at: string,
    updated_at: string,
}

export type Modules = {
    index: number
    amount: number,
    lecturer_id: string,
    lecturer_name: string,
    start_lesson: string,
    total_lesson: string,
    time: TimeClassroom[],
    subject_id: string,
    room_id: string,
    datetime: string,
    day_of_week: number,
    group_id: string,
    pratice_id: string,
    credit: number,
    subject_name: string,
    time_detail: TimeDetail[],
    id: number,
    subject_group: string,
    practice_group: string,
    capacity: string,
    day: string,
    start_periods: string,
    no_periods: string,
    week_study: string,
    subject_primary_id: string,
    no_credit: string,
    lecturer_uuid: string,
    lecturer_first_name: string,
    lecturer_last_name: string,
    classroom_id: string,
    classroom_label: string,
}

export type TimeClassroom = {
    classroom: string,
    week: number,
    day: number,
    time: number,
}

export type TimeDetail = {
    day: number,
    classroom: string,
    start_time: number,
    total_lesson: number,
}

export type ThesisType = {
    id: string,
    name: string,
    student_id: string[],
    student_name: string[],
    lecturer_id: string,
    lecturer_name: string,
    board_id: string[],
    board_name: string[],
    date: string,
    time: string,
    room: string,
    lecturer: string,
}

export type TimeType = {
    time_id: number,
    hour: number,
    day: number,
    week: number,
    id: number,
    classroom_id: number,
    status: number,
    note: string,
    lecturer_first_name: string,
    lecturer_last_name: string
}

export type WeekType = {
    id: number,
    startTime: string,
    endTime: string,
}

export type SubjectType = {
    id: number,
    subject_id: string,
    name: string,
    no_credit: string,
    major_id: string,
    is_delete: 0,
    create_at: string,
    update_at: string
}

export type NoticeType = {
    title: string,
    content: string,
    created_by: string,
    id: string

}

export type RoomTime = {
    classroom_id: string,
    day: string,
    hour: string,
    is_confirm: string,
    lecturer_first_name: string,
    lecturer_id: string,
    lecturer_last_name: string,
    lecturer_uuid: string,
    note: string,
    time_id: string,
    week: string,
    status: number
}

export type ItemClassRoom = {
    week: number,
    id: number,
    label: string,
    day: TimeType[][],
}

export type ItemClassRoomDetail = {
    lecturer_id: string,
    lecturer_name: string,
    day: number,
    time: number,
    time_id: number,
    note: string
}

export type Page = {
    current: number,
    total: number,
    limit: number
}

export type PermissionRole = {
    permission_id: number;
    role_id: number
}