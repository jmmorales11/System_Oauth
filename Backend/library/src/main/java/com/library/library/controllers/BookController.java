package com.library.library.controllers;

import com.library.library.models.BookModel;
import com.library.library.services.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/book")
public class BookController {
    @Autowired
    BookService bookService;

    //API get all books
    @CrossOrigin(origins="*")
    @GetMapping
    public List<BookModel> getBooks(){
        return bookService.getAllBooks();
    }

    //API saves books
    @PostMapping
    public BookModel saveBook(@RequestBody BookModel book){
        return bookService.saveBook(book);
    }

    //API get book by id
    @GetMapping("/{id}")
    public Optional<BookModel> getBookById(@PathVariable("id") Integer id){
        return bookService.getBookById(id);
    }

    // API get some data book (codigo, libro, autor, descripción y status)
    @GetMapping("/some-data")
    public List<Map<String, Object>> getBooksSomeData() {
        return bookService.getBookSomeData();
    }

    //API edit book
    @PutMapping("/update/{id}")
    public BookModel updateBook(@RequestBody BookModel book, @PathVariable("id") Integer id){
        return bookService.updateBook(book, id);
    }

    //API disable book (desactivarlo)
    @PutMapping("/delete/{id}")
    public BookModel deleteBook(@PathVariable("id") Integer id){
        return bookService.deleteBook(id);
    }

    //API get total amount books
    @GetMapping("/amount")
    public BigDecimal totalAmount(){
        return bookService.totalAmountBook();
    }

}
