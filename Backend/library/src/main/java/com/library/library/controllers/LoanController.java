package com.library.library.controllers;

import com.library.library.DTO.BinacleDTO;
import com.library.library.DTO.LoanUserBookDTO;
import com.library.library.models.BookModel;
import com.library.library.models.LoanModel;
import com.library.library.services.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/loan")
public class LoanController {

    @Autowired
    LoanService loanServices;

    //API para obtener todos los prestamos
    @GetMapping
    public List<LoanModel> getLoan(){
        return loanServices.getAllLoan();
    }

    //API para obetener (cedula, nombre, apellido, codigo, libro, Fecha de adquisicion, Fecha de devolución)
    @CrossOrigin(origins="*")
    @GetMapping("/some-data")
    public List<LoanUserBookDTO> getSomeData(){
        return loanServices.getAllLoanUserBook();
    }

    //API para obtener los datos de la bitacora
    @CrossOrigin(origins="*")
    @GetMapping("/binnacle")
    public List<BinacleDTO> getDataBinnacle(){
        return loanServices.getDataBinnacle();
    }

    //API para guardar un préstamo
    @PostMapping
    @CrossOrigin(origins="*")
    public LoanModel saveLoan(@RequestBody LoanModel loan){
        return loanServices.saveLoan(loan);
    }

    //API para actaulizar datos
    @PutMapping("/update/{id}")
    public LoanModel updateLoan(@RequestBody LoanModel loanModel,@PathVariable("id") Integer id){
        return this.loanServices.updateLoan(loanModel, id);
    }

    //API para devolver el libro
    @CrossOrigin(origins="*")
    @PutMapping("/returned-book/{id}")
    public LoanModel returnedBook(@RequestBody LoanModel loanModel,  @PathVariable("id") Integer id){
        return loanServices.returnedBook(loanModel, id);
    }

    //API para mostrar libros más leídos
    @GetMapping("/ranking-books")
    public List<Map<String, Object>> getRankingBooks(){
        return loanServices.getRankingBooks();
    }

    //API para mostrar estudiantes que más han leído
    @GetMapping("/ranking-users")
    public List<Map<String, Object>> getRankingUser(){
        return loanServices.getRankingStudents();
    }

}
