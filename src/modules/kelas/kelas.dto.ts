import { DatabaseService } from "src/config/database/database.service";

export class KelasDto {
    kode : string
    wali_kelas : number
    created_at : string
    updated_at : string
}

export class UpsertKelasDto {
    kode : string
    wali_kelas : number
}


export class FilterkelasDto  {
    limit? :  number = 10
    page? : number = 1
    search? : string
}