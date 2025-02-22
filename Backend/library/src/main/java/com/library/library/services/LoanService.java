package com.library.library.services;

import com.library.library.DTO.BinacleDTO;
import com.library.library.DTO.LoanUserBookDTO;
import com.library.library.Utils.LoanValidations;
import com.library.library.models.BookModel;
import com.library.library.models.LoanModel;
import com.library.library.models.UserModel;
import com.library.library.repositories.IBookRepository;
import com.library.library.repositories.ILoanRepository;
import com.library.library.repositories.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;

@Service
public class LoanService {

    @Autowired
    private ILoanRepository loanRepository;

    @Autowired
    private IBookRepository bookRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private BookService bookService;
    
    //Get all loans
    public List<LoanModel> getAllLoan(){
        try {
            List<LoanModel> loans = loanRepository.findAll();
            if (loans.isEmpty()) {
                return new ArrayList<>();
            }
            return loans;
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener la lista de préstamos", e);
        }
    }

    //Get some loan data-book and user
    public List<LoanUserBookDTO> getAllLoanUserBook() {
        List<LoanModel> loans = getAllLoan();
        List<LoanUserBookDTO> information = new ArrayList<>();

        for (LoanModel loan : loans) {
            if (!loan.isConfirm_devolution()) {
                LoanUserBookDTO dto = new LoanUserBookDTO();
                dto.setId_loan(loan.getIdloan());
                dto.setCodeUser(loan.getUser().getCode());
                dto.setUser_name(loan.getUser().getUser_name());
                dto.setUser_last_name(loan.getUser().getUser_last_name());
                dto.setCodeBook(loan.getBook().getCode());
                dto.setTitle(loan.getBook().getTitle());
                dto.setAuthor(loan.getBook().getAuthor());
                dto.setAcquisition_date(loan.getAcquisition_date());
                dto.setDate_of_devolution(loan.getDate_of_devolution());

                information.add(dto);
            }
        }
        return information;
    }


    public List<BinacleDTO> getDataBinnacle() {
        List<LoanModel> loans = getAllLoan();
        List<BinacleDTO> dataBinnacle = new ArrayList<>();

        for (LoanModel loan : loans) {
            BinacleDTO dto = new BinacleDTO();

            dto.setCodeBook(loan.getBook().getCode());
            dto.setAuthor(loan.getBook().getAuthor());
            dto.setGrade(loan.getBook().getGrade());
            dto.setTitle(loan.getBook().getTitle());
            dto.setLanguage(loan.getBook().getLanguage());
            dto.setSection(loan.getBook().getSection());
            dto.setUser_name(loan.getUser().getUser_name());
            dto.setUser_last_name(loan.getUser().getUser_last_name());
            dto.setMail(loan.getUser().getMail());
            dto.setRole(loan.getUser().getRole());
            dto.setAcquisition_date(loan.getAcquisition_date());
            dto.setDate_of_devolution(loan.getDate_of_devolution());
            dto.setConfirm_devolution(loan.isConfirm_devolution());

            dataBinnacle.add(dto);
        }

        return dataBinnacle;
    }

    //Save a loan
    public LoanModel saveLoan(LoanModel loanModel) {

        LoanModel loan = new LoanModel();
        if (!LoanValidations.validateDate(loanModel.getDate_of_devolution())) {
            throw new RuntimeException("Fecha Inválida");
        }

        Optional<UserModel> userOptional = userRepository.findById(loanModel.getUser().getId_user());
        if (!userOptional.isPresent()) {
            throw new RuntimeException("Usuario no encontrado");
        }

        Optional<BookModel> bookOptional = bookRepository.findById(loanModel.getBook().getId_book());
        if (!bookOptional.isPresent()) {
            throw new RuntimeException("Libro no encontrado");
        }


        BookModel book = bookOptional.get();

        if(!book.isStatus()){
            throw new RuntimeException("Este libro ya ha sido alquilado");
        }

        book.setStatus(false);

        bookRepository.save(book);

        loanModel.setConfirm_devolution(false);
        loan.setAcquisition_date(loanModel.getAcquisition_date());

        return loanRepository.save(loanModel);
    }

    //Enable book status after being returned
    public LoanModel returnedBook(LoanModel request, Integer id){
        LoanModel loan = loanRepository.findById(id).get();
        loan.setConfirm_devolution(true);

         loan.setDate_of_devolution(request.getDate_of_devolution());


        BookModel bookModel = loan.getBook();
        bookModel.setStatus(true);

        return loanRepository.save(loan);
    }

    //Update loan
    public LoanModel updateLoan(LoanModel request, Integer id){
        if(!LoanValidations.validateDate(request.getDate_of_devolution())){
            throw new RuntimeException("Fecha Inválida");
        }

        LoanModel loan = loanRepository.findById(id).get();
        loan.setDate_of_devolution(request.getDate_of_devolution());
        return loanRepository.save(loan);
    }

    //Show of the most read books
    public List<Map<String, Object>> getRankingBooks(){
        List<LoanModel> loans = getAllLoan();
        List<BookModel> books = bookService.getAllBooks();

        Map<String, Integer> bookLoanCount = new LinkedHashMap<>();
        Map<String, String> bookAuthor = new LinkedHashMap<>();
        Map<String, String> bookDescription = new LinkedHashMap<>();
        Map<String, String> bookLanguage = new LinkedHashMap<>();
        Map<String, String> bookGrade = new LinkedHashMap<>();

        for(LoanModel loan:loans){

            if(loan.isConfirm_devolution()) {
                String title = loan.getBook().getTitle();
                bookLoanCount.put(title, bookLoanCount.getOrDefault(title, 0) + 1);

                if (!bookAuthor.containsKey(title)) {
                    bookAuthor.put(title, loan.getBook().getAuthor());
                    bookDescription.put(title, loan.getBook().getDescription());
                    bookLanguage.put(title, loan.getBook().getLanguage());
                    bookGrade.put(title, loan.getBook().getGrade());
                }
            }
        }

        for (BookModel book : books) {
            String title = book.getTitle();
            if (!bookLoanCount.containsKey(title)) {
                bookLoanCount.put(title, 0);
                bookAuthor.put(title, book.getAuthor());
                bookDescription.put(title, book.getDescription());
                bookLanguage.put(title, book.getLanguage());
                bookGrade.put(title, book.getGrade());
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for(Map.Entry<String, Integer> entry : bookLoanCount.entrySet()){
            Map<String, Object> bookData = new LinkedHashMap<>();
            bookData.put("title", entry.getKey());
            bookData.put("author", bookAuthor.get(entry.getKey()));
            bookData.put("description", bookDescription.get(entry.getKey()));
            bookData.put("language", bookLanguage.get(entry.getKey()));
            bookData.put("grade", bookGrade.get(entry.getKey()));
            bookData.put("loan_count", entry.getValue());
            result.add(bookData);
        }

        result.sort((book1, book2) -> (Integer) book2.get("loan_count") - (Integer) book1.get("loan_count"));

        return result;
    }


    //Show of students with the highest number of readings
    public List<Map<String, Object>> getRankingStudents(){
        List<LoanModel> loan = getAllLoan();
        Map<Integer, Integer> studentsLoanCount = new LinkedHashMap<>();
        Map<Integer, String> userFirstName = new LinkedHashMap<>();
        Map<Integer, String> userLastName = new LinkedHashMap<>();
        Map<Integer, String> userGrade = new LinkedHashMap<>();
        Map<Integer, String> userCode =  new LinkedHashMap<>();


        for (LoanModel loans : loan) {
            if (loans.isConfirm_devolution() && loans.getUser().getCode() != null) {
                int idUser = loans.getUser().getId_user();
                String firstName = loans.getUser().getUser_name();
                String lastName = loans.getUser().getUser_last_name();
                String grade = loans.getUser().getGrade();
                String code = loans.getUser().getCode();

                userFirstName.putIfAbsent(idUser, firstName);
                userLastName.putIfAbsent(idUser, lastName);
                userGrade.putIfAbsent(idUser, grade);
                userCode.putIfAbsent(idUser, code);

                studentsLoanCount.put(idUser, studentsLoanCount.getOrDefault(idUser, 0) + 1);
            }
        }

        List<Map<String, Object>> ranking = new ArrayList<>();
        for (Map.Entry<Integer, Integer> entry : studentsLoanCount.entrySet()) {
            Integer idUser = entry.getKey();
            Map<String, Object> studentInfo = new LinkedHashMap<>();
            studentInfo.put("id", idUser);
            studentInfo.put("firstName", userFirstName.get(idUser));
            studentInfo.put("lastName", userLastName.get(idUser));
            studentInfo.put("code", userCode.get(idUser));
            studentInfo.put("grade", userGrade.get(idUser));
            studentInfo.put("count", entry.getValue());
            ranking.add(studentInfo);
        }

        ranking.sort((a, b) -> (Integer) b.get("count") - (Integer) a.get("count"));

        return ranking;
    }
}
