export type Role  = "kepala_sekolah" | "guru" | "siswa" | "wali_murid"
export class RefreshTokenDto {
  refreshToken: string;
}

export class User    {
    id : number
    username : string
    email : string
    password : string
    role : Role
    createdAt : string
    updatedAt : string
}

export class LoginDto  {
    username : string
    password : string
}

export class RegisterDto  {
    username : string
    email : string
    password : string
    role : Role
}