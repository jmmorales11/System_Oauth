package com.library.library.services;

import com.library.library.Utils.BooksValidations;
import com.library.library.excepcion.ValidationException;
import com.library.library.models.BookModel;
import com.library.library.repositories.IBookRepository;
import com.library.library.repositories.ILoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class BookService {

    @Autowired
    IBookRepository bookRepository;

    @Autowired
    ILoanRepository loanRepository;

    //Get all book
    public List<BookModel> getAllBooks(){
        try {
            List<BookModel> books = bookRepository.findAll();
            if (books.isEmpty()) {
                return new ArrayList<>();
            }
            return books;
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener la lista de libros", e);
        }
    }

    //get book by id
    public Optional<BookModel> getBookById(Integer id){
        return bookRepository.findById(id);
    }

    //Get some books data
    public List<Map<String, Object>> getBookSomeData(){
        try{
            List<BookModel> books = getAllBooks();
            List<Map<String, Object>> bookSomeData = new ArrayList<>();

            if (books.isEmpty()) {
                return new ArrayList<>();
            }

            for(BookModel book:books){
                Map<String, Object> bookData = new LinkedHashMap<>();
                bookData.put("code", book.getCode());
                bookData.put("title", book.getTitle());
                bookData.put("author", book.getAuthor());
                bookData.put("description", book.getDescription());
                bookData.put("price",book.getPrice());
                bookData.put("status", book.isStatus());

                bookSomeData.add(bookData);
            }

            return bookSomeData;
        }catch (Exception e){
            throw new RuntimeException("Error al obtener la lista de libros", e);
        }
    }


    //Save book
    public BookModel saveBook(BookModel book) {
        List<String> errors = new ArrayList<>();

        Optional<BookModel> existingBook = bookRepository.findByCode(String.valueOf(book.getCode()));
        if (existingBook.isPresent()) {
            throw new RuntimeException("El libro con el código " + book.getCode() + " ya se encuentra registrado dentro del sistema");
        }
        if (!BooksValidations.validateTitle(book.getTitle())) {
            errors.add("Título Inválido");
        }
        if (!BooksValidations.validateAuthor(book.getAuthor())) {
            errors.add("Autor Inválido");
        }
        if (!BooksValidations.validateLanguage(book.getLanguage())) {
            errors.add("Idioma Inválido");
        }
        if (!BooksValidations.validateCode(book.getCode())) {
            errors.add("Código Inválido");
        }
        if (!BooksValidations.validateGrade(book.getGrade())) {
            errors.add("Grado Inválido");
        }
        if (!BooksValidations.validateSection(book.getSection())) {
            errors.add("Sección Inválida");
        }
        if (!BooksValidations.validateDescription(book.getDescription())) {
            errors.add("Descripción Inválida");
        }
        if (!BooksValidations.validatePhysical_State(book.getPhysical_state())) {
            errors.add("Estado Físico Inválido");
        }

        try {
            if (!BooksValidations.validatePrice(book.getPrice() != null ? book.getPrice().toString() : null)) {
                errors.add("Precio Inválido");
            }
        } catch (IllegalArgumentException e) {
            errors.add(e.getMessage());
        }

        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }

        book.setStatus(true);
        return bookRepository.save(book);
    }



    //Update book data
    public BookModel updateBook(BookModel request, Integer id){
        List<String> errors = new ArrayList<>();
        Optional<BookModel> existingBook = bookRepository.findById(id);
        if(existingBook.isPresent()){
            BookModel book = existingBook.get();

            if(!BooksValidations.validateTitle(request.getTitle())){
                errors.add("Título Inválido");
            }
            if(!BooksValidations.validateAuthor(request.getAuthor())){
                errors.add("Autor Inválido");
            }
            if (!BooksValidations.validateLanguage(request.getLanguage())){
                errors.add("Idioma Inválido");
            }
            if(!BooksValidations.validateGrade(request.getGrade())){
                errors.add("Grado Inválido");
            }
            if(!BooksValidations.validateSection(request.getSection())){
                errors.add("Sección Inválida");
            }
            if(!BooksValidations.validateDescription(request.getDescription())){
                errors.add("Descripción Inválida");
            }
            if(!BooksValidations.validatePhysical_State(request.getPhysical_state())){
                errors.add("Estado Físico Inválido");
            }
            try {
                if (!BooksValidations.validatePrice(book.getPrice() != null ? book.getPrice().toString() : null)) {
                    errors.add("Precio Inválido");
                }
            } catch (IllegalArgumentException e) {
                errors.add(e.getMessage());
            }

            if (!request.getCode().equals(book.getCode())) {
                if (!BooksValidations.validateCode(request.getCode())) {
                    errors.add("Código Inválido");
                }

                Optional<BookModel> existingBooks = bookRepository.findByCode(request.getCode());
                if (existingBooks.isPresent()) {
                    errors.add("El libro con la código "+ request.getCode()+" ya se encuentra registrado dentro del sistema");
                }
            }

            if (!errors.isEmpty()) {
                throw new ValidationException(errors);
            }

            book.setTitle(request.getTitle());
            book.setAuthor(request.getAuthor());
            book.setLanguage(request.getLanguage());
            book.setCode(request.getCode());
            book.setGrade(request.getGrade());
            book.setSection(request.getSection());
            book.setDescription(request.getDescription());
            book.setPhysical_state(request.getPhysical_state());
            book.setPrice(request.getPrice());

            return bookRepository.save(book);
        }else{
            throw new RuntimeException("Este libro no se encuentra registrado dentro del sistema");
        }
    }

    //"Delete" Update book status to disable in the system
    public BookModel deleteBook(Integer id){
        try{
            Optional<BookModel> existingBook = bookRepository.findById(id);
            if(existingBook.isPresent()){

                boolean userLoanActive = loanRepository.findAll().stream().anyMatch(loan -> loan.getBook().getId_book() == id
                        && !loan.isConfirm_devolution());
                if (userLoanActive) {
                    throw new RuntimeException("El libro se encuentra en préstamos pendientes y no puede ser deshabilitado.");
                }
                BookModel book = existingBook.get();
                book.setStatus(false);
                return bookRepository.save(book);
            }else{
                throw new RuntimeException("Este libro no se encuentra registrado dentro del sistema");
            }
        } catch (Exception e) {
            throw e;
        }
    }

    //Get total amount of book prices
    public BigDecimal totalAmountBook() {
        try {
            List<BookModel> books = bookRepository.findAll();

            if (books.isEmpty()) {
                return BigDecimal.ZERO;
            }

            BigDecimal totalAmount = books.stream()
                    .map(BookModel::getPrice)
                    .filter(price -> price != null)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            return totalAmount;
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener el monto total de los precios de los libros", e);
        }
    }

}

