import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { KelasService } from "./kelas.service";
import { FilterkelasDto, UpsertKelasDto } from "./kelas.dto";

@Controller("kelas")
export class KelasController {
    
    constructor(private readonly  kelasService : KelasService){}
    @Post("")
    async CreateKelas(@Body()  req : UpsertKelasDto){
        return this.kelasService.Create(req)
    }
    @Get("")
    async findAll(@Query()  req : FilterkelasDto){
        return this.kelasService.GetAll(req)
    }

}