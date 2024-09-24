import { UsersInterface } from "./IUser";

export interface HistoryInterface {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    LoginTimestamp: string;
    UserID: number;
    User: UsersInterface; // เพิ่ม User เพื่อเก็บข้อมูลเกี่ยวกับผู้ใช้
}